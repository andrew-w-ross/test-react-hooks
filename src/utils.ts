import { act } from "react-test-renderer";

export function randomNumber() {
    return Date.now() + Math.floor(Math.random() * 100000);
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

/**
 * Creates a deferred object with the promise, reject and resolve value.
 * Will reset the internal state whenever a resolve or reject occures
 */
export function createDeferred<T = void>() {
    const result = {
        resolve: (_value: T | PromiseLike<T>) => {},
        reject: (_reason?: any) => {},
        promise: Promise.resolve((null as unknown) as T),
    };

    function reset() {
        result.promise = new Promise<T>((resolve, reject) => {
            result.resolve = resolve;
            result.reject = reject;
        }).finally(() => reset());
    }

    reset();

    return result;
}
