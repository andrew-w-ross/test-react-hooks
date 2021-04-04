import { createWaitForNextUpdate } from "../updateWaiter";
import { wait } from "../utils";

const rejectSpy = jest.fn();
const resolveSpy = jest.fn();

it("waitForNextUpdate.updateCount will wait for a specific amount of async update", async () => {
    const { updateSubject, waitForNextUpdate } = createWaitForNextUpdate();
    waitForNextUpdate().updateCount(2).then(resolveSpy);

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
    const { updateSubject, waitForNextUpdate } = createWaitForNextUpdate();
    waitForNextUpdate().debounce(3).then(resolveSpy);

    updateSubject.next({ async: true });
    await wait(2);
    expect(resolveSpy).not.toHaveBeenCalled();

    updateSubject.next({ async: true });
    await wait(2);
    expect(resolveSpy).not.toHaveBeenCalled();

    await wait(4);
    expect(resolveSpy).toHaveBeenCalled();
});

it("by default use debounce function", () => {
    const { waitForNextUpdate } = createWaitForNextUpdate();

    const updateWaiter = waitForNextUpdate();
    const debounceSpy = jest.spyOn(updateWaiter, "debounce");

    expect(debounceSpy).not.toHaveBeenCalled();

    //Then will force execution
    updateWaiter.then(resolveSpy);
    expect(debounceSpy).toHaveBeenCalled();
});

it("will throw if an error is piped through", async () => {
    const { waitForNextUpdate, updateSubject } = createWaitForNextUpdate();

    const error = new Error("boom");
    waitForNextUpdate().then(resolveSpy, rejectSpy);
    updateSubject.next({ error });

    await wait();

    expect(resolveSpy).not.toHaveBeenCalled();
    expect(rejectSpy).toHaveBeenCalledWith(error);
});

it("will throw if an error occures during act", async () => {
    const { waitForNextUpdate } = createWaitForNextUpdate();

    const error = new Error("boom");
    const updateWait = waitForNextUpdate().act(() => {
        throw error;
    });

    await expect(updateWait).rejects.toEqual(error);
});

// it("will swallow erros if asked", async () => {
//     const rejectSpy = jest.fn();
//     const resolveSpy = jest.fn();
//     const { updateSubject, waitForNextUpdate } = createWaitForNextUpdate();
//     waitForNextUpdate()
//         .updateCount(1)
//         .swallowErrors()
//         .then(resolveSpy, rejectSpy);

//     await updateSubject.next({ error: new Error("boom") });
//     expect(rejectSpy).not.toHaveBeenCalled();
//     expect(resolveSpy).not.toHaveBeenCalled();

//     await updateSubject.next({ async: true });
//     expect(rejectSpy).not.toHaveBeenCalled();
//     expect(resolveSpy).toHaveBeenCalled();
// });
