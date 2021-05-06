import { useMemo } from "react";
import { createTestProxy } from "../createTestProxy";
import { SUSPENDED } from "../models";

type Result =
    | { type: "error"; error: any }
    | { type: "running"; execution: Promise<any> }
    | { type: "completed"; result: any };

const RESULT_CACHE = new Map<Function, Result>();

export function useAsyncSuspense<TResult>(fn: () => Promise<TResult>): TResult {
    if (!RESULT_CACHE.has(fn)) {
        const execution = fn()
            .then((result) => {
                RESULT_CACHE.set(fn, { type: "completed", result });
            })
            .catch((error) => {
                RESULT_CACHE.set(fn, { type: "error", error });
            });
        RESULT_CACHE.set(fn, { type: "running", execution });
    }

    return useMemo(() => {
        const state = RESULT_CACHE.get(fn)!;

        switch (state.type) {
            case "running":
                throw state.execution;
            case "error":
                throw state.error;
            default:
                return state.result;
        }
    }, [fn]);
}

afterEach(() => {
    RESULT_CACHE.clear();
});

const [prxAsyncSuspense, control] = createTestProxy(useAsyncSuspense);

it("will wait for suspense", async () => {
    const getStuff = () => Promise.resolve(1);
    {
        expect(prxAsyncSuspense(getStuff)).toBe(SUSPENDED);
    }

    await control.waitForNextUpdate();

    {
        const result = prxAsyncSuspense(getStuff);
        expect(result).toBe(1);
    }
});

it("will throw on waitForNextUpdate if suspense rejects", async () => {
    const throwStuff = () => Promise.reject("Boom Suspense");

    {
        expect(prxAsyncSuspense(throwStuff)).toBe(SUSPENDED);
    }

    await expect(control.waitForNextUpdate()).rejects.toBe("Boom Suspense");
});
