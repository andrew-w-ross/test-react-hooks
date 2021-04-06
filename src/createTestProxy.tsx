import type { FC } from "react";
import type { HookRendererOptions, TestHook } from "./hookRenderer";
import { createHookRenderer } from "./hookRenderer";
import { createWaitForNextUpdate } from "./updateWaiter";

const cleanUpFns: Function[] = [];

export function cleanUp() {
    cleanUpFns.splice(0, cleanUpFns.length).forEach((func) => func());
}

if (!process.env.TEST_REACT_HOOKS_NO_CLEANUP) globalThis?.afterEach?.(cleanUp);

export type UseProxyOptions = Partial<
    Pick<HookRendererOptions, "testRendererOptions" | "wrapper">
>;

const DefaultWrapper: FC = ({ children }) => <>{children}</>;

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
    const {
        updateSubject,
        waitForNextUpdate,
        clearSubject,
    } = createWaitForNextUpdate();

    const renderOptions = {
        ...options,
        updateSubject,
        wrapper: options.wrapper ?? DefaultWrapper,
    };

    const { renderHook, cleanup: renderCleanup, unmount } = createHookRenderer(
        hook,
        renderOptions,
    );

    const cleanup = () => {
        renderCleanup();
        clearSubject();
    };

    //@ts-expect-error
    const render: THook = (...params: Parameters<THook>) => {
        if (!cleanUpFns.includes(cleanup)) {
            cleanUpFns.push(cleanup);
        }

        return renderHook(...params);
    };

    const control = {
        get updateObserver() {
            return updateSubject.asObservable();
        },
        unmount,
        set wrapper(newWrapper: React.ComponentType<{}> | null) {
            renderOptions.wrapper = newWrapper ?? DefaultWrapper;
        },
        waitForNextUpdate,
    };

    return [render, control] as const;
}
