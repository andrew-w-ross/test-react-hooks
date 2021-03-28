import { returnAct, createDeferred } from "../utils";

describe("returnAct", () => {
    it("return a sync value", () => {
        expect(returnAct(() => 1)).toBe(1);
    });

    it("returns an async value", async () => {
        const promiseAct = () => new Promise((resolve) => resolve(1));
        await expect(returnAct(promiseAct)).resolves.toBe(1);
    });
});

describe("createDeferred", () => {
    beforeEach(() => {
        jest.useFakeTimers("modern");
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.runOnlyPendingTimers();
    });

    it("will resolve a value", async () => {
        const deferred = createDeferred<number>();

        deferred.resolve(1);
        jest.runOnlyPendingTimers();

        await expect(deferred.promise).resolves.toEqual(1);
    });

    it("will reject a value", async () => {
        const deferred = createDeferred<number>();
        deferred.reject(new Error("rejected"));
        await expect(deferred.promise).rejects.toThrow("rejected");
    });

    it("will reset on resolve", async () => {
        const deferred = createDeferred<number>();

        deferred.resolve(1);
        jest.runOnlyPendingTimers();
        await expect(deferred.promise).resolves.toEqual(1);

        deferred.resolve(2);
        jest.runOnlyPendingTimers();
        await expect(deferred.promise).resolves.toEqual(2);
    });

    it("can be rejected multiple times", async () => {
        const deferred = createDeferred<number>();

        deferred.reject(new Error("first error"));
        await expect(deferred.promise).rejects.toThrow("first error");

        deferred.reject(new Error("second error"));
        await expect(deferred.promise).rejects.toThrow("second error");
    });

    it("by default will throttle for 2ms", async () => {
        const resolveSpy = jest.fn();
        const deferred = createDeferred<number>();
        deferred.promise.then(resolveSpy);

        expect(resolveSpy).not.toHaveBeenCalled();

        deferred.resolve(1);
        jest.advanceTimersByTime(1);
        expect(resolveSpy).not.toHaveBeenCalled();

        deferred.resolve(1);
        jest.advanceTimersByTime(1);
        expect(resolveSpy).not.toHaveBeenCalled();

        jest.advanceTimersByTime(1);
        await deferred.promise;
        expect(resolveSpy).toHaveBeenCalledWith(1);
    });
});
