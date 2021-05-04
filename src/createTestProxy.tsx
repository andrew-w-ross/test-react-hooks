import type { ComponentType, ReactNode } from "react";
import type { TestRendererOptions } from "react-test-renderer";
import type { WrapApplyFn } from "./proxy";
import { wrapProxy } from "./proxy";
import { RenderState } from "./RenderState";
import { createUpdateStream } from "./updateWaiter";
import { isPromiseLike, returnAct } from "./utils";

//TODO : Add suspense checks
export const SUSPENDED = Symbol("Suspended Result");

export type Suspended = typeof SUSPENDED;

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

/**
 * Options for @see createTestProxy
 */
export type CreateTestProxyOptions = {
    /**
     * Options that are forwared to @see {@link https://reactjs.org/docs/test-renderer.html react-test-renderer }
     */
    testRendererOptions?: TestRendererOptions;

    /**
     * Wrapper component for the hook callback, make sure children is rendered
     */
    wrapper?: WrapperComponent;
};

/**
 * Creates a proxy hook and a control object for that hook
 * Proxy hook will rerender when called and wrap
 * Calls in act when appropriate
 *
 * @export
 * @template THook
 * @param {THook} hook to proxy
 * @param {CreateTestProxyOptions} [options={}]
 * @returns {[THook, HookControl<TProps>]}
 */
export function createTestProxy<THook extends TestHook>(
    hook: THook,
    { testRendererOptions, wrapper }: CreateTestProxyOptions = {},
) {
    const { updateSubject, createWaiter, hoistError } = createUpdateStream();
    const renderState = new RenderState(updateSubject, testRendererOptions);

    const cleanup = () => {
        renderState.unmount();
    };

    /**
     * Function that will ensure a function and all it's returned memebers are wrapped in act
     */
    const wrapApplyAct: WrapApplyFn = (...args) => {
        return hoistError(() => {
            try {
                const result = returnAct(() => Reflect.apply(...args));
                updateSubject.next({ async: !renderState.isRendering });
                return result;
            } catch (err) {
                if (isPromiseLike(err)) {
                    if (renderState.isRendering) throw err;
                    //If we are rendering then throw back so react can handle
                    err.then(
                        () => updateSubject.next({ async: true }),
                        (error) => updateSubject.next({ error }),
                    );
                } else {
                    updateSubject.next({ error: err });
                }
            }
        });
    };

    const proxiedHook = wrapProxy(hook, wrapApplyAct);

    //@ts-expect-error
    const renderHook: THook = (...params: Parameters<THook>) => {
        if (!cleanUpFns.includes(cleanup)) {
            cleanUpFns.push(cleanup);
        }
        let isCalled = false;
        let result: ReturnType<TestHook> | Suspended = SUSPENDED;
        const Wrapper = wrapper ?? DefaultWrapper;

        const callback = () => {
            isCalled = true;
            result = proxiedHook(...params);
        };

        hoistError(() =>
            renderState.render(
                <Wrapper>
                    <CallbackComponent callback={callback} />
                </Wrapper>,
            ),
        );

        if (!isCalled) {
            console.warn(
                "Check the code for your wrapper, it should render the children prop",
            );
        }

        return result;
    };

    const control = {
        /**
         * Sets the wrapper, passing in null or undefined will use the default wrapper.
         * Setting this does not force a render.
         */
        set wrapper(wrapperComponent: WrapperComponent | null | undefined) {
            wrapper = wrapperComponent ?? undefined;
        },

        /**
         * Unmount the current component.
         */
        unmount: () => hoistError(() => renderState.unmount()),

        /**
         * Creates an @see UpdateWaiter that by default will wait for the component to stop updating for `2ms`.
         * @returns UpdateWaiter
         */
        waitForNextUpdate: () => createWaiter(),
    };

    return [renderHook, control] as const;
}

export type TestProxyControl = ReturnType<typeof createTestProxy>[1];
