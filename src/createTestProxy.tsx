import type { FC } from "react";
import type { ReactTestRenderer } from "react-test-renderer";
import { act, create } from "react-test-renderer";
import { CallbackComponent } from "./CallbackComponent";
import { ErrorBoundary } from "./ErrorBoundary";
import type { WrapApplyFn } from "./proxy";
import { wrapProxy } from "./proxy";
import type { WaiterFunction } from "./utils";
import { createDeferred, returnAct } from "./utils";

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

export type UseProxyOptions = {
    /**
     * Component to wrap the test component in
     */
    wrapper?: React.ComponentType<{}>;
    throttleFn?: WaiterFunction | null;
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
    { throttleFn, wrapper }: UseProxyOptions = {},
) {
    let Wrapper = wrapper ?? DefaultWrapper;
    let reactTestRenderer: ReactTestRenderer | null = null;
    let result: ReturnType<TestHook> | undefined = undefined;
    let caughtError: Error | null = null;
    const proxiedHook = wrapProxy(hook, wrapApplyAct);

    const deferredUpdate = createDeferred(throttleFn);

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
                                deferredUpdate.resolve();
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
        waitForNextUpdate: (actFn: () => any = () => {}) =>
            act(async () => {
                await actFn();
                await deferredUpdate.promise;
            }),
    };

    return [render as THook, control] as const;
}
