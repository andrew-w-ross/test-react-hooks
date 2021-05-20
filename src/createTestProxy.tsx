import type { ComponentType, ReactNode } from "react";
import type { TestRendererOptions, act } from "react-test-renderer";
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

if (!process.env.TEST_REACT_HOOKS_NO_CLEANUP) {
    if (typeof globalThis?.afterEach === "function") {
        globalThis?.afterEach?.(cleanUp);
    } else {
        console.warn(
            "No afterEach function found on the global scope, please call cleanUp function between tests.",
        );
    }
}

type CallbackHookProps = {
    callback: Function;
};

const CallbackComponent = ({ callback }: CallbackHookProps) => {
    callback();
    return null;
};

/**
 * Wrapper component to take in and render the children
 */
export type WrapperComponent = ComponentType<{ children: ReactNode }>;

const DefaultWrapper: WrapperComponent = ({ children }) => <>{children}</>;

export type TestHook = (...args: any[]) => any;

/**
 * Options for {@link createTestProxy}
 */
export type CreateTestProxyOptions = {
    /**
     * Options that are forwarded to {@link https://reactjs.org/docs/test-renderer.html react-test-renderer }
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
     * If this is set to false {@link waitForNextUpdate} will not reject on error and instead the next invocation will throw.
     */
    autoInvokeSuspense?: boolean;

    /**
     * The act function that react needs, use this if you need to use multiple react {@link https://reactjs.org/docs/testing-recipes.html#multiple-renderers multiple-renderers}
     */
    actFn?: typeof act;
};

/**
 * Main function for `test-react-hooks`
 * Creates a proxy hook and a control object for that hook
 * Proxy hook will rerender when called and wrap calls in act when appropriate
 *
 * @export
 * @template THook type of the hook to proxy, should be inferred from hook argument
 * @param {THook} hook to proxy
 * @param {CreateTestProxyOptions} [options={}]
 * @returns {[THook, HookControl<TProps>]} tuple where the first result is the proxied hook and the second is the control object.
 */
export function createTestProxy<THook extends TestHook>(
    hook: THook,
    //If you destructor the args the naming gets odd in documentation
    options: CreateTestProxyOptions = {},
) {
    const {
        testRendererOptions,
        strict = true,
        autoInvokeSuspense = true,
        actFn,
        wrapper: wrapperArg,
    } = options;

    let wrapper = wrapperArg;

    const { updateSubject, createWaiter, hoistError } = createUpdateStream();
    const renderState = new RenderState(updateSubject, testRendererOptions);

    const cleanup = () => {
        renderState.unmount();
        //Reset to the original wrapper
        wrapper = wrapperArg;
    };

    const handleProxyErrors = (error: Error) => {
        if (strict) throw error;
        console.warn(`${error.name}: ${error.message}`);
    };

    /**
     * Function that will ensure a function and all it's returned members are wrapped in act
     */
    const wrapApplyAct: WrapApplyFn = (...args) => {
        return hoistError(() => {
            try {
                const result = returnAct(() => Reflect.apply(...args), actFn);
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
                            if (autoInvokeSuspense) {
                                //This probably doesn't need to wrapped in act
                                returnAct(() => Reflect.apply(...args), actFn);
                            }

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
         * Creates an {@link UpdateWaiter} that by default will wait for the component to stop updating for `2ms`.
         * @returns UpdateWaiter
         */
        waitForNextUpdate: () => createWaiter(),
    };

    return [renderHook, control] as const;
}

export type TestProxyControl = ReturnType<typeof createTestProxy>[1];
