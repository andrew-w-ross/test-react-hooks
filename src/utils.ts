import { act } from "react-test-renderer";
import assert from "assert";

export function randomNumber() {
    return Date.now() + Math.floor(Math.random() * 100000);
}

export function isPromiseLike(value: any): value is PromiseLike<any> {
    return value != null && typeof value.then === "function";
}

const NO_RESULT = Symbol("NO_RESULT");

export function returnAct<TResult>(actFn: () => TResult): TResult {
    let result: typeof NO_RESULT | TResult = NO_RESULT;

    act(() => {
        result = actFn();
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

    assert(resolveFn, "Did not execute");
    assert(rejectFn, "Did not execute");

    return {
        promise,
        executor: {
            resolve: resolveFn!,
            reject: rejectFn!,
        },
    };
}
