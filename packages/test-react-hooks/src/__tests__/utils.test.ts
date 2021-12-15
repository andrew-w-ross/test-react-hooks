import { returnAct, promiseWithExternalExecutor } from "../utils";

describe("returnAct", () => {
    it("return a sync value", () => {
        expect(returnAct(() => 1)).toBe(1);
    });

    it("returns an async value", async () => {
        const promiseAct = () => new Promise((resolve) => resolve(1));
        await expect(returnAct(promiseAct)).resolves.toBe(1);
    });

    it("will throw if act throws", () => {
        const errorFn = () => {
            throw new Error("boom");
        };
        expect(() => returnAct(errorFn)).toThrowError("boom");
    });
});

describe("promiseWithExternalExecutor", () => {
    afterEach(() => {
        jest.useRealTimers();
    });

    it(`it'll resolve with an external executor`, async () => {
        const { promise, executor } = promiseWithExternalExecutor();
        queueMicrotask(() => {
            executor.resolve(1);
        });
        await expect(promise).resolves.toEqual(1);
    });

    it(`it'll reject with an external executor`, async () => {
        const { promise, executor } = promiseWithExternalExecutor();
        queueMicrotask(() => {
            executor.reject(new Error("boom async"));
        });
        await expect(promise).rejects.toThrowError("boom async");
    });

    it(`it'll resolve with an external executor on legacy timers`, async () => {
        jest.useFakeTimers("legacy");
        const { promise, executor } = promiseWithExternalExecutor();
        queueMicrotask(() => {
            executor.resolve(1);
        });
        await expect(promise).resolves.toEqual(1);
    });

    it(`it'll reject with an external executor  on legacy timers`, async () => {
        jest.useFakeTimers("legacy");
        const { promise, executor } = promiseWithExternalExecutor();
        queueMicrotask(() => {
            executor.reject(new Error("boom async"));
        });
        await expect(promise).rejects.toThrowError("boom async");
    });

    //Modern timers have this annoyying habit of patching microtasks
    it(`it'll resolve with an external executor on modern timers`, async () => {
        jest.useFakeTimers("modern");
        const { promise, executor } = promiseWithExternalExecutor();
        queueMicrotask(() => {
            executor.resolve(1);
        });

        //Modern timer hack,
        Promise.resolve().then(() => jest.runAllTicks());
        await expect(promise).resolves.toEqual(1);
    });

    it(`it'll reject with an external executor on modern timers`, async () => {
        jest.useFakeTimers("modern");
        const { promise, executor } = promiseWithExternalExecutor();
        queueMicrotask(() => {
            executor.reject(new Error("boom async"));
        });

        //Act hack
        Promise.resolve().then(() => jest.runOnlyPendingTimers());
        await expect(promise).rejects.toThrowError("boom async");
    });
});
