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
