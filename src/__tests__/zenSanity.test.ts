import Observable from "zen-observable";
import { wait } from "../utils";

const createTimerObservable = () =>
    new Observable((subscriber) => {
        const timer = setTimeout(() => {
            subscriber.complete();
        }, 10);

        return () => clearTimeout(timer);
    });

const nextSpy = jest.fn();
const errorSpy = jest.fn();
const completeSpy = jest.fn();

//This is why rxjs couldn't be used, no matter what scheduler is set it didn't play nice with fake timers modern or legacy
describe("fakeTimers - legacy", () => {
    beforeEach(() => {
        jest.useFakeTimers("legacy");
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it("will wait for 10ms", async () => {
        const timerObservable = createTimerObservable();
        timerObservable.subscribe(nextSpy, errorSpy, completeSpy);
        expect(completeSpy).not.toHaveBeenCalled();

        jest.advanceTimersByTime(12);
        expect(completeSpy).toHaveBeenCalled();
    });
});

describe("fakeTimers - modern", () => {
    beforeEach(() => {
        jest.useFakeTimers("modern");
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it("will wait for 10ms", async () => {
        const timerObservable = createTimerObservable();
        timerObservable.subscribe(nextSpy, errorSpy, completeSpy);
        expect(completeSpy).not.toHaveBeenCalled();

        jest.advanceTimersByTime(12);
        expect(completeSpy).toHaveBeenCalled();
    });
});

describe("realTimers", () => {
    it("will wait for 10ms", async () => {
        const timerObservable = createTimerObservable();
        timerObservable.subscribe(nextSpy, errorSpy, completeSpy);
        expect(completeSpy).not.toHaveBeenCalled();

        await wait(12);
        expect(completeSpy).toHaveBeenCalled();
    });
});
