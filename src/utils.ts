import { act } from "react-test-renderer";

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

export type CreateDeferredOptions = {
    throttleTimeout?: number | null;
};

/**
 * Creates a deferred object with the promise, reject and resolve value.
 * Will reset the internal state whenever a resolve or reject occures
 */
export function createDeferred<T = void>({
    throttleTimeout,
}: CreateDeferredOptions = {}) {
    let internalPromise = (Promise.resolve() as unknown) as Promise<T>;
    let listenerCount = 0;

    const result = {
        get listenerCount() {
            return listenerCount;
        },
        resolve: (_value: T | PromiseLike<T>) => {},
        reject: (_reason?: any) => {},
        get promise() {
            listenerCount++;
            return internalPromise;
        },
    };

    function reset() {
        internalPromise = new Promise<T>((resolve, reject) => {
            result.resolve =
                throttleTimeout == null
                    ? resolve
                    : throttleFn(resolve, throttleTimeout);

            result.reject = reject;
            listenerCount = 0;
        }).finally(() => reset());
    }

    reset();

    return result;
}

export function throttleFn<TArgs extends any[]>(
    fn: (...args: TArgs) => any,
    ms = 2,
) {
    let timeout: null | number = null;

    return (...args: TArgs) => {
        if (timeout != null) {
            clearTimeout(timeout);
        }

        timeout = (setTimeout(() => {
            fn(...args);
        }, ms) as unknown) as number;
    };
}
