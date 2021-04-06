import type {
    ReactTestRenderer,
    TestRendererOptions,
} from "react-test-renderer";
import { act, create } from "react-test-renderer";
import type { Subject } from "rxjs";
import { ErrorBoundary } from "./ErrorBoundary";
import type { WrapApplyFn } from "./proxy";
import { wrapProxy } from "./proxy";
import type { UpdateEvent } from "./updateWaiter";
import { randomNumber, returnAct } from "./utils";

type CallbackHookProps = {
    callback: Function;
};

const CallbackComponent = ({ callback }: CallbackHookProps) => {
    callback();
    return null;
};

/**
 * Function that will ensure a function and all it's returned memebers are wrapped in act
 */
const wrapApplyAct: WrapApplyFn = (...args) =>
    returnAct(() => Reflect.apply(...args));

export type TestHook = (...args: any[]) => any;

export type HookRendererOptions = {
    updateSubject: Subject<UpdateEvent>;
    wrapper: React.ComponentType<{}>;
    testRendererOptions?: TestRendererOptions;
};

export function createHookRenderer<THook extends TestHook>(
    hook: THook,
    {
        updateSubject,
        testRendererOptions,
        wrapper: Wrapper,
    }: HookRendererOptions,
) {
    const proxiedHook = wrapProxy(hook, wrapApplyAct);

    let key: string | null = null;
    let reactTestRenderer: ReactTestRenderer | null = null;

    const cleanup = () => {
        act(() => {
            if (reactTestRenderer) {
                reactTestRenderer.unmount();
            }
        });
        reactTestRenderer = null;
        key = null;
    };

    const unmount = () => {
        act(() => {
            reactTestRenderer?.unmount();
        });
    };

    const renderHook = (...params: Parameters<THook>) => {
        //The first render is in reponse to the hook
        //The next ones are due to hooks forcing an update
        let isAsync = false;
        let caughtError: Error | null = null;
        let result: ReturnType<TestHook> | undefined = undefined;

        if (key == null) {
            key = randomNumber() + "";
        }

        const callback = () => {
            try {
                result = proxiedHook(...params);
            } catch (error) {
                if (!isAsync) throw error;
                updateSubject.next({ error });
            } finally {
                isAsync = true;
                updateSubject.next({ async: isAsync });
            }
        };

        const element = (
            <ErrorBoundary
                key={key}
                onError={(error) => {
                    caughtError = error;
                }}
            >
                <Wrapper>
                    <CallbackComponent callback={callback} />
                </Wrapper>
            </ErrorBoundary>
        );

        act(() => {
            if (reactTestRenderer == null) {
                reactTestRenderer = create(element, testRendererOptions);
            } else {
                reactTestRenderer.update(element);
            }
        });

        if (!isAsync) {
            console.warn(
                "Check the code for your wrapper, it should render the children prop",
            );
        }

        if (caughtError) {
            throw caughtError;
        }

        return result!;
    };

    return {
        renderHook,
        cleanup,
        unmount,
    };
}
