import type { ComponentType, ReactNode } from "react";
import type { TestRendererOptions } from "react-test-renderer";
import type { Suspended } from "./models";
import { CheckWrapperError, UnknownError } from "./models";
import { AlreadySuspendedError, SUSPENDED } from "./models";
import type { WrapApplyFn } from "./proxy";
import { wrapProxy } from "./proxy";
import { RenderState } from "./RenderState";
import { createUpdateStream } from "./updateWaiter";
import { isPromiseLike, returnAct } from "./utils";

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
     * Options that are forwared to {@link https://reactjs.org/docs/test-renderer.html react-test-renderer }
     */
    testRendererOptions?: TestRendererOptions;

    /**
     * Wrapper component for the hook callback, make sure children is rendered
     */
    wrapper?: WrapperComponent;

    /**
     * Should the proxy throw an error or print a warning, defaults to true.
     */
    strict?: boolean;

    /**
     * When a proxied function that is not in the initial render call suspends it has to be invoked after the promise resolves to see if it ultimately failed.
     * If this is set to false {@see waitForNextUpdate} will not reject on error and instead the next invocation will throw.
     */
    autoInvokeSuspense?: boolean;
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
    {
        testRendererOptions,
        wrapper,
        strict = true,
        autoInvokeSuspense = true,
    }: CreateTestProxyOptions = {},
) {
    const { updateSubject, createWaiter, hoistError } = createUpdateStream();
    const renderState = new RenderState(updateSubject, testRendererOptions);

    const cleanup = () => {
        renderState.unmount();
    };

    const handleProxyErrors = (error: Error) => {
        if (strict) throw error;
        console.warn(`${error.name}: ${error.message}`);
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
            } catch (callerror) {
                if (isPromiseLike(callerror)) {
                    //If we are rendering then throw back so react can handle
                    if (renderState.isRendering) throw callerror;

                    callerror.then(() => {
                        //This could be done better inside of renderState
                        renderState.isSuspended = false;
                        try {
                            //This probably doesn't need to
                            returnAct(() => Reflect.apply(...args));
                            updateSubject.next({ async: true });
                        } catch (error) {
                            updateSubject.next({ error });
                        }
                    });
                } else {
                    updateSubject.next({ error: callerror });
                }
            }
            if (renderState.isSuspended) {
                handleProxyErrors(new AlreadySuspendedError(args));
            }
            renderState.isSuspended = true;
            return SUSPENDED;
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
            if (Wrapper === DefaultWrapper) {
                //This shouldn't happen, famous last words. Instead throw an error explaining where to raise an issue.
                throw new UnknownError();
            } else {
                handleProxyErrors(new CheckWrapperError(Wrapper));
            }

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
