import { createWaitForNextUpdate } from "../updateWaiter";
import { wait } from "../utils";

const resolveSpy = jest.fn();

beforeEach(() => {
    jest.useFakeTimers("modern");
});

afterEach(() => {
    jest.useRealTimers();
});

it("waitForNextUpdate can debounce on async events", async () => {
    const { updateSubject, waitForNextUpdate } = createWaitForNextUpdate();
    waitForNextUpdate().debounce(3).then(resolveSpy);

    updateSubject.next({ async: true });
    expect(resolveSpy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2);
    expect(resolveSpy).not.toHaveBeenCalled();

    updateSubject.next({ async: true });

    jest.advanceTimersByTime(2);
    expect(resolveSpy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(8);
    expect(resolveSpy).toHaveBeenCalled();
});
// it("by default will wait for 2ms", async () => {
//     const { updateSubject, waitForNextUpdate } = createWaitForNextUpdate();

//     waitForNextUpdate().then(resolveSpy);
//     updateSubject.next({ async: true });
//     expect(resolveSpy).not.toHaveBeenCalled();

//     await wait(3);
//     expect(resolveSpy).toHaveBeenCalled();
// });

// it("will throw if an error occures while waiting", () => {
//     const { updateSubject, waitForNextUpdate } = createWaitForNextUpdate();
//     const waitPromise = waitForNextUpdate();

//     updateSubject.next({ error: new Error("boom") });
//     expect(waitPromise).rejects.toThrowError("boom");
// });

// it("can wait for aribrity amount of time", async () => {
//     const { updateSubject, waitForNextUpdate } = createWaitForNextUpdate();

//     waitForNextUpdate({ ms: 3 }).then(resolveSpy);
//     updateSubject.next(true);
//     expect(resolveSpy).not.toHaveBeenCalled();

//     await wait(4);
//     expect(resolveSpy).toHaveBeenCalled();
// });
