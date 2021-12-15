import type { ComponentType } from "react";

/**
 * Update events while rendering
 *  If async is true then the update is happening in response to something other than a direct call to the hook.
 *  If error is defined then something went wrong.
 */
export type UpdateEvent =
    | { async: boolean; error?: undefined }
    | { error: unknown; async?: undefined };

/**
 * Symbol that is returned if the call to that function is suspended.
 */
export const SUSPENDED = Symbol("Suspended Result");

/**
 * Type alias for the {@link SUSPENDED} symbol
 */
export type Suspended = typeof SUSPENDED;

/**
 * Thrown if a hook is already in a suspended state.
 * Probably means that you'll need to wait for the suspension to complete.
 */
export class AlreadySuspendedError extends Error {
    constructor(applyArgs?: unknown[]) {
        super(AlreadySuspendedError.getErrorMessage(applyArgs));
    }

    /**
     *
     * @param applyArgs Arguments sent to {@link Reflect.apply}
     */
    static getErrorMessage(applyArgs?: unknown[]) {
        const fn = applyArgs?.[0];
        const fnName = typeof fn === "function" ? fn.name : null;

        return `${fnName ?? "NA"} called while the hook was suspended. 
This wouldn't happen in a react component as the previous suspended call would have exited the current call stack. 
Use waitForNextUpdate() before calling.`;
    }
}

export class AlreadyExecutedError extends Error {
    constructor() {
        super("Already executed");
    }
}

/**
 * Wrapper component passed in did not render it's children.
 */
export class CheckWrapperError extends Error {
    constructor(wrapper: ComponentType<any>) {
        super(CheckWrapperError.getErrorMessage(wrapper));
    }

    static getErrorMessage(wrapper: ComponentType<any>): string {
        const componentName =
            wrapper.displayName ?? wrapper.name ?? "WrapperComponent";
        return `Component ${componentName} did not render it's children. Check the wrapper code is passing on it's children.`;
    }
}

/**
 * Something has gone wrong please report this issue.
 */
export class UnknownError extends Error {
    constructor() {
        super(
            "An unexpected error has occurred please submit an issue to https://github.com/andrew-w-ross/test-react-hooks/issues",
        );
    }
}
