import { createWaitForNextUpdate } from "../updateWaiter";
import { wait } from "../utils";

const resolveSpy = jest.fn();

it("waitForNextUpdate.updateCount will wait for a specific amount of async update", async () => {
    const { updateSubject, createWaiter } = createWaitForNextUpdate();
    createWaiter().updateCount(2).wait().then(resolveSpy);

    updateSubject.next({ async: false });
    await wait();
    expect(resolveSpy).not.toHaveBeenCalled();

    updateSubject.next({ async: true });
    await wait();
    expect(resolveSpy).not.toHaveBeenCalled();

    updateSubject.next({ async: true });
    await wait();

    expect(resolveSpy).toHaveBeenCalled();
});

it("waitForNextUpdate.debounce can debounce on async events", async () => {
    const { updateSubject, createWaiter } = createWaitForNextUpdate();
    createWaiter().debounce(10).wait().then(resolveSpy);

    updateSubject.next({ async: true });
    await wait(6);
    expect(resolveSpy).not.toHaveBeenCalled();

    updateSubject.next({ async: true });
    await wait(6);
    expect(resolveSpy).not.toHaveBeenCalled();

    await wait(8);
    expect(resolveSpy).toHaveBeenCalled();
});

it("by default use debounce function", () => {
    const { createWaiter } = createWaitForNextUpdate();

    const updateWaiter = createWaiter();
    const debounceSpy = jest.spyOn(updateWaiter, "debounce");

    expect(debounceSpy).not.toHaveBeenCalled();

    //Then will force execution
    updateWaiter.wait();
    expect(debounceSpy).toHaveBeenCalled();
});

it("will throw if an error is piped through", async () => {
    const { createWaiter, updateSubject } = createWaitForNextUpdate();

    const error = new Error("boom");
    const waitPromise = createWaiter().wait();
    updateSubject.next({ error });

    await expect(waitPromise).rejects.toThrowError(error);
});

it("will throw if an error occures during act", async () => {
    const { createWaiter } = createWaitForNextUpdate();

    const updateWait = createWaiter()
        .act(() => {
            throw new Error("boom");
        })
        .wait();

    await expect(updateWait).rejects.toThrowError("boom");
});

it("will warn if act function is overriden", () => {
    const errorSpy = jest.spyOn(console, "warn");
    const { createWaiter } = createWaitForNextUpdate();

    const updateWaiter = createWaiter().act(() => {});
    expect(errorSpy).not.toHaveBeenCalled();

    updateWaiter.act(() => {});
    expect(errorSpy).toHaveBeenCalled();
});

it("will wait for one of the promises to resolve in race", async () => {
    const { createWaiter, updateSubject } = createWaitForNextUpdate();

    createWaiter()
        .waitMode("race")
        .updateCount(1)
        .updateCount(2)
        .wait()
        .then(resolveSpy);

    expect(resolveSpy).not.toHaveBeenCalled();

    updateSubject.next({ async: true });
    await wait();
    expect(resolveSpy).toHaveBeenCalled();
});

it("will wait for all of the promises to resolve in race", async () => {
    const { createWaiter, updateSubject } = createWaitForNextUpdate();

    createWaiter()
        .waitMode("all")
        .updateCount(1)
        .updateCount(2)
        .wait()
        .then(resolveSpy);

    expect(resolveSpy).not.toHaveBeenCalled();

    updateSubject.next({ async: true });
    await wait();
    expect(resolveSpy).not.toHaveBeenCalled();

    updateSubject.next({ async: true });
    await wait();
    expect(resolveSpy).toHaveBeenCalled();
});

it("will throw if modified after wait", () => {
    const { createWaiter } = createWaitForNextUpdate();

    const waiter = createWaiter();
    waiter.wait();

    expect(() => waiter.debounce()).toThrowError();
});

it("will return the same promise for multiple calls to wait()", () => {
    const { createWaiter } = createWaitForNextUpdate();

    const waiter = createWaiter();
    const waitPromise1 = waiter.wait();
    const waitPromise2 = waiter.wait();

    expect(waitPromise1).toEqual(waitPromise2);
});
