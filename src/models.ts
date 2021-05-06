import type { ComponentType } from "react";

/**
 * Result type that is returned if the call to that function is suspended.
 */
export const SUSPENDED = Symbol("Suspended Result");

export type Suspended = typeof SUSPENDED;

export class AlreadySuspendedError extends Error {
    constructor(applyArgs: any[]) {
        super(AlreadySuspendedError.getErrorMessage(applyArgs));
    }

    /**
     *
     * @param appyArgs Arguments sent to {@see Reflect.apply}
     */
    static getErrorMessage(applyArgs: any[]) {
        const fn = applyArgs?.[0];
        const fnName = typeof fn === "function" ? fn.name : null;

        return `${fnName ?? "NA"} called while the hook was suspended. 
                This wouldn't happen in a react component as the previous suspended call would have exited the current call stack. 
                Use waitForNextUpdate() before calling.`;
    }
}

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

export class UnknownError extends Error {
    constructor() {
        super(
            "An unexpected error has occurred please submit an issue to https://github.com/andrew-w-ross/test-react-hooks/issues",
        );
    }
}
