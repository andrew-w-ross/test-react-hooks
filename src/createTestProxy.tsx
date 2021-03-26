import type { FC } from "react";
import type { ReactTestRenderer } from "react-test-renderer";
import { act, create } from "react-test-renderer";
import { ErrorBoundary } from "./ErrorBoundary";
import type { WrapApplyFn } from "./proxy";

import { wrapProxy } from "./proxy";
import { createDeferred, returnAct } from "./utils";
import { CallbackComponent } from "./CallbackComponent";

export type TestHook = (...args: any[]) => any;

const cleanUpFns: Function[] = [];

export function cleanUp() {
    cleanUpFns.splice(0, cleanUpFns.length).forEach((func) => func());
}

if (!process.env.TEST_REACT_HOOKS_NO_CLEANUP) globalThis?.afterEach?.(cleanUp);

const DefaultWrapper: FC = ({ children }) => <>{children}</>;

/**
 * Function that will ensure a function and all it's returned memebers are wrapped in act
 */
const wrapApplyAct: WrapApplyFn = (...args) =>
    returnAct(() => Reflect.apply(...args));

/**
 * Options for createTestProxy
 *
 * @export
 * @interface UseProxyOptions
 * @template TProps
 */
export interface UseProxyOptions {
    /**
     * Component to wrap the test component in
     */
    wrapper?: React.ComponentType<{}>;
}

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
    options: UseProxyOptions = {},
) {
    let { wrapper: Wrapper = DefaultWrapper } = options;
    let reactTestRenderer: ReactTestRenderer | null = null;
    let result: ReturnType<TestHook> | undefined = undefined;
    let caughtError: Error | null = null;
    const proxiedHook = wrapProxy(hook, wrapApplyAct);

    const deferred = createDeferred();

    function cleanup() {
        act(() => {
            if (reactTestRenderer) {
                reactTestRenderer.unmount();
            }
        });
        reactTestRenderer = null;
    }

    const render = (...params: Parameters<THook>) => {
        let wasCalled = false;
        caughtError = null;
        const element = (
            <ErrorBoundary
                onError={(error) => {
                    caughtError = error;
                }}
            >
                <Wrapper>
                    <CallbackComponent
                        callback={() => {
                            wasCalled = true;
                            try {
                                result = proxiedHook(...params);
                            } finally {
                                deferred.resolve();
                            }
                        }}
                    />
                </Wrapper>
            </ErrorBoundary>
        );

        act(() => {
            if (reactTestRenderer == null) {
                reactTestRenderer = create(element);
                cleanUpFns.push(cleanup);
            } else {
                reactTestRenderer.update(element);
            }
        });

        if (!wasCalled && Wrapper !== DefaultWrapper) {
            console.warn(
                "Check the code for your wrapper, it should render the children prop",
            );
        }

        if (caughtError) {
            throw caughtError;
        }

        return result;
    };

    const control = {
        get error() {
            return caughtError;
        },
        unmount: () => {
            act(() => {
                reactTestRenderer?.unmount();
            });
        },
        set wrapper(newWrapper: React.ComponentType<{}> | null) {
            Wrapper = newWrapper ?? DefaultWrapper;
        },
        waitForNextUpdate: () => returnAct(() => deferred.promise),
    };

    return [render as THook, control] as const;
}
