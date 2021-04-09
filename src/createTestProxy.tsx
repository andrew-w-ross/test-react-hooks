import type { ComponentType, ReactNode } from "react";
import type { TestRendererOptions } from "react-test-renderer";
import type { WrapApplyFn } from "./proxy";
import { wrapProxy } from "./proxy";
import { RenderState } from "./RenderState";
import { createWaitForNextUpdate } from "./updateWaiter";
import { returnAct } from "./utils";

const cleanUpFns: Function[] = [];

export function cleanUp() {
    cleanUpFns.splice(0, cleanUpFns.length).forEach((func) => func());
}

if (!process.env.TEST_REACT_HOOKS_NO_CLEANUP) globalThis?.afterEach?.(cleanUp);

type CallbackHookProps = {
    callback: Function;
};

const CallbackComponent = ({ callback }: CallbackHookProps) => {
    callback();
    return null;
};

/**
 * Wrapper component has to take in and render the children
 */
export type WrapperComponent = ComponentType<{ children: ReactNode }>;

const DefaultWrapper: WrapperComponent = ({ children }) => <>{children}</>;

export type TestHook = (...args: any[]) => any;

export type UseProxyOptions = {
    testRendererOptions?: TestRendererOptions;
    wrapper?: WrapperComponent;
};

/**
 * Creates a proxy hook and a control object for that hook
 * Proxy hook will rerender when called and wrap
 * Calls in act when appropriate
 *
 * @export
 * @template THook
 * @template TProps
 * @param {THook} hook
 * @param {UseProxyOptions<TProps>} [options={}]
 * @returns {[THook, HookControl<TProps>]}
 */
export function createTestProxy<THook extends TestHook>(
    hook: THook,
    { testRendererOptions, wrapper }: UseProxyOptions = {},
) {
    const {
        updateSubject,
        waitForNextUpdate,
        clearSubject,
    } = createWaitForNextUpdate();

    let renderState = new RenderState(testRendererOptions);
    //Is the hook responding to a direct call from the user?
    let respondingToCall = false;

    const cleanup = () => {
        renderState.cleanup();
        renderState = new RenderState(testRendererOptions);
        clearSubject();
    };

    /**
     * Function that will ensure a function and all it's returned memebers are wrapped in act
     */
    const wrapApplyAct: WrapApplyFn = (...args) => {
        respondingToCall = true;
        const result = returnAct(() => Reflect.apply(...args));
        respondingToCall = false;
        if (renderState.caughtError) throw renderState.caughtError;
        return result;
    };

    const proxiedHook = wrapProxy(hook, wrapApplyAct);

    //@ts-expect-error
    const renderHook: THook = (...params: Parameters<THook>) => {
        respondingToCall = true;
        if (!cleanUpFns.includes(cleanup)) {
            cleanUpFns.push(cleanup);
        }
        let result: ReturnType<TestHook> | undefined = undefined;

        try {
            let isAsync = false;
            const Wrapper = wrapper ?? DefaultWrapper;

            const callback = () => {
                try {
                    result = proxiedHook(...params);
                } catch (error) {
                    if (!isAsync || respondingToCall) throw error;
                    updateSubject.next({ error });
                } finally {
                    //TODO : This is wrong, should first emit if async is try and then set isAsync
                    isAsync = true;
                    updateSubject.next({ async: isAsync });
                }
            };

            renderState.render(
                <Wrapper>
                    <CallbackComponent callback={callback} />
                </Wrapper>,
            );

            if (!isAsync) {
                console.warn(
                    "Check the code for your wrapper, it should render the children prop",
                );
            }
        } finally {
            respondingToCall = false;
        }

        return result!;
    };

    const control = {
        get updateObserver() {
            return updateSubject.asObservable();
        },
        set wrapper(wrapperComponent: WrapperComponent | null | undefined) {
            wrapper = wrapperComponent ?? undefined;
        },
        unmount: () => renderState.unmount(),
        waitForNextUpdate,
    };

    return [renderHook, control] as const;
}

export type TestProxyControl = ReturnType<typeof createTestProxy>[1];
