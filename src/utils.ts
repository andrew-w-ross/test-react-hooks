import { act } from "react-test-renderer";

export function randomNumber() {
    return Date.now() + Math.floor(Math.random() * 100000);
}

export function isPromiseLike(value: any): value is PromiseLike<any> {
    return value != null && typeof value.then === "function";
}

export const NO_RESULT = Symbol("NO_RESULT");
export type NoResult = typeof NO_RESULT;

export function returnAct<TResult>(fn: () => TResult, actFn = act): TResult {
    let result: NoResult | TResult = NO_RESULT;

    actFn(() => {
        result = fn();
    });

    if (result === NO_RESULT) {
        throw new Error("Act was not called");
    }

    return result;
}

export const wait = (ms = 0) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

export const noOp = () => {};

export type PromiseResolve<T> = (value: T | PromiseLike<T>) => void;
export type PromiseReject = (reason?: any) => void;

export function promiseWithExternalExecutor<T = unknown>() {
    let resolveFn: PromiseResolve<T> | null = null;
    let rejectFn: PromiseReject | null = null;

    const promise = new Promise<T>((resolve, reject) => {
        resolveFn = resolve;
        rejectFn = reject;
    });

    

    return {
        promise,
        executor: {
            resolve: resolveFn!,
            reject: rejectFn!,
        },
    };
}
