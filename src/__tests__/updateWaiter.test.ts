import { createWaitForNextUpdate } from "../updateWaiter";
import { wait } from "../utils";

const resolveSpy = jest.fn();

it("waitForNextUpdate.updateCount will wait for a specific amount of async update", async () => {
    const { updateSubject, createWaiter } = createWaitForNextUpdate();
    createWaiter().updateCount(2).then(resolveSpy);

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
    createWaiter().debounce(10).then(resolveSpy);

    updateSubject.next({ async: true });
    await wait(6);
    expect(resolveSpy).not.toHaveBeenCalled();

    updateSubject.next({ async: true });
    await wait(6);
    expect(resolveSpy).not.toHaveBeenCalled();

    await wait(8);
    expect(resolveSpy).toHaveBeenCalled();
});

it("by default use debounce function", async () => {
    const { createWaiter } = createWaitForNextUpdate();

    const updateWaiter = createWaiter();
    const debounceSpy = jest.spyOn(updateWaiter, "debounce");

    expect(debounceSpy).not.toHaveBeenCalled();

    //Then will force execution
    await wait();
    expect(debounceSpy).toHaveBeenCalled();
});

it("will throw if an error is piped through", async () => {
    const { createWaiter, updateSubject } = createWaitForNextUpdate();

    const waitPromise = createWaiter();
    //Force execution
    await wait();

    const error = new Error("boom");
    updateSubject.next({ error });

    await expect(waitPromise).rejects.toThrowError(error);
});

it("will throw if an error occures during act", async () => {
    const { createWaiter } = createWaitForNextUpdate();

    const updateWait = createWaiter().act(() => {
        throw new Error("boom");
    });

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
        .iterationMode("race")
        .updateCount(1)
        .updateCount(2)
        .then(resolveSpy);
    //force execution
    await wait();

    await wait();
    expect(resolveSpy).not.toHaveBeenCalled();

    updateSubject.next({ async: true });
    await wait();
    expect(resolveSpy).toHaveBeenCalled();
});

it("will wait for all of the promises to resolve in race", async () => {
    const { createWaiter, updateSubject } = createWaitForNextUpdate();

    createWaiter().iterationMode("all").updateCount(2).then(resolveSpy);
    await wait();

    updateSubject.next({ async: true });
    await wait();
    expect(resolveSpy).not.toHaveBeenCalled();

    updateSubject.next({ async: true });
    await wait();
    expect(resolveSpy).toHaveBeenCalled();
});

it("will throw if modified after wait", async () => {
    const { createWaiter } = createWaitForNextUpdate();

    const waiter = createWaiter();
    await Promise.resolve();

    expect(() => waiter.debounce()).toThrowError();
});
