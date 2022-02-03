import { createUpdateStream } from "../updateWaiter";
import { wait } from "../utils";

const resolveSpy = jest.fn();

it("can be used as a fluent api", () => {
    const { createWaiter } = createUpdateStream();

    const waiter = createWaiter();
    expect(waiter.waiters).toHaveLength(0);

    waiter.debounce(10);
    expect(waiter.waiters).toHaveLength(1);

    waiter.updateCount(2);
    expect(waiter.waiters).toHaveLength(2);
});

it("waitForNextUpdate.updateCount will wait for a specific amount of async update", async () => {
    const { updateSubject, createWaiter } = createUpdateStream();
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
    const { updateSubject, createWaiter } = createUpdateStream();
    const waitPromise = createWaiter().debounce(30).then(resolveSpy);

    updateSubject.next({ async: true });
    await wait(14);
    expect(resolveSpy).not.toHaveBeenCalled();

    updateSubject.next({ async: true });
    await wait(14);
    expect(resolveSpy).not.toHaveBeenCalled();

    await waitPromise;
    expect(resolveSpy).toHaveBeenCalled();
});

it("by default use debounce function", async () => {
    const { createWaiter } = createUpdateStream();

    const updateWaiter = createWaiter();
    const debounceSpy = jest.spyOn(updateWaiter, "debounce");

    expect(debounceSpy).not.toHaveBeenCalled();

    //Then will force execution
    await wait();
    expect(debounceSpy).toHaveBeenCalled();
});

it("will throw if an error is piped through", async () => {
    const { createWaiter, updateSubject } = createUpdateStream();

    const waitPromise = createWaiter();
    //Force execution
    await wait();

    const error = new Error("boom");
    updateSubject.next({ error });

    await expect(waitPromise).rejects.toThrowError(error);
});

it("will throw if an error occurs during act", async () => {
    const { createWaiter } = createUpdateStream();

    const updateWait = createWaiter().act(() => {
        throw new Error("boom");
    });

    await expect(updateWait).rejects.toThrowError("boom");
});

it("will warn if act function is overridden", () => {
    const errorSpy = jest.spyOn(console, "warn");
    const { createWaiter } = createUpdateStream();

    const updateWaiter = createWaiter().act(() => {});
    expect(errorSpy).not.toHaveBeenCalled();

    updateWaiter.act(() => {});
    expect(errorSpy).toHaveBeenCalled();
});

it("will wait for one of the promises to resolve in race", async () => {
    const { createWaiter, updateSubject } = createUpdateStream();

    createWaiter().waitRace().updateCount(1).updateCount(2).then(resolveSpy);
    //force execution
    await wait();
    expect(resolveSpy).not.toHaveBeenCalled();

    updateSubject.next({ async: true });
    await wait();

    expect(resolveSpy).toHaveBeenCalled();
});

it("will wait for all of the promises to resolve in all", async () => {
    const { createWaiter, updateSubject } = createUpdateStream();

    createWaiter().waitAll().updateCount(2).then(resolveSpy);
    await wait();
    expect(resolveSpy).not.toHaveBeenCalled();

    updateSubject.next({ async: true });
    await wait();
    expect(resolveSpy).not.toHaveBeenCalled();

    updateSubject.next({ async: true });
    await wait();
    expect(resolveSpy).toHaveBeenCalled();
});

it("will throw if modified after wait", async () => {
    const { createWaiter } = createUpdateStream();

    const waiter = createWaiter();
    await wait();

    expect(() => waiter.debounce()).toThrowError();
});
