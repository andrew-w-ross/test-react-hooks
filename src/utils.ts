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

export type WaiterFunction<TArgs extends any[] = []> = (
    ...args: TArgs
) => Promise<any>;

export type Deferred<T = void> = {
    readonly listenerCount: number;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
    readonly promise: Promise<T>;
};

/**
 * Creates a deferred object with the promise, reject and resolve value.
 * Will reset the internal state whenever a resolve or reject occures
 * @param throttleTime time to wait for resolves calls to stop before resolving the promise
 */
export function createDeferred<T = void>(throttleTime?: number | null) {
    let internalPromise = (Promise.resolve() as unknown) as Promise<T>;
    let listenerCount = 0;

    const result: Deferred<T> = {
        get listenerCount() {
            return listenerCount;
        },
        resolve: () => {
            throw new Error("Init was not called");
        },
        reject: () => {
            throw new Error("Init was not called");
        },
        get promise() {
            listenerCount++;
            return internalPromise;
        },
    };

    function reset() {
        internalPromise = new Promise<T>((resolve, reject) => {
            result.resolve =
                throttleTime == null
                    ? resolve
                    : throttleFn(resolve, throttleTime);

            result.reject = reject;
            listenerCount = 0;
        }).finally(() => reset());
    }

    reset();

    return result;
}

export function throttleFn<TArgs extends any[]>(
    fn: (...args: TArgs) => any,
    throttleTime: number,
) {
    let timerHandle: any = null;

    return async (...args: TArgs) => {
        if (timerHandle != null) {
            clearTimeout(timerHandle);
            timerHandle = null;
        }

        timerHandle = setTimeout(() => {
            fn(...args);
        }, throttleTime);
    };
}

export const wait = (ms = 1) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

export const noOp = () => {};
