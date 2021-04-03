import { Subject, debounce, take, toPromise } from "../observer-utils";

const valueSpy = jest.fn();
const errorSpy = jest.fn();
const completeSpy = jest.fn();

describe("Subject", () => {
    it("will forward value", () => {
        const subject = new Subject();

        const observer = subject.getObservable();
        observer.subscribe(valueSpy);
        subject.next(null);

        expect(valueSpy).toHaveBeenCalled();
    });

    it("will forward errors", () => {
        const subject = new Subject();

        const observer = subject.getObservable();
        observer.subscribe(valueSpy, errorSpy);

        const error = new Error("boom");
        subject.error(error);
        expect(errorSpy).toHaveBeenCalledWith(error);
    });

    it("will forward complete", () => {
        const subject = new Subject();

        const observer = subject.getObservable();
        observer.subscribe(valueSpy, errorSpy, completeSpy);

        subject.complete();

        expect(completeSpy).toHaveBeenCalled();
    });
});

describe("take", () => {
    it("will return after x elements", () => {
        const subject = new Subject<number>();
        const takeObserver = take(subject.getObservable(), 2);
        const subscription = takeObserver.subscribe(
            valueSpy,
            errorSpy,
            completeSpy,
        );

        subject.next(1);
        expect(valueSpy).not.toHaveBeenCalled();

        subject.next(2);
        expect(valueSpy).toHaveBeenCalledWith([1, 2]);

        subscription.unsubscribe();
    });
});

describe("debounce", () => {
    beforeEach(() => {
        jest.useFakeTimers("modern");
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it("will wait for time to emit the last value", () => {
        const subject = new Subject<number>();
        const takeObserver = debounce(subject.getObservable(), 10);
        const subscription = takeObserver.subscribe(
            valueSpy,
            errorSpy,
            completeSpy,
        );

        subject.next(1);
        jest.advanceTimersByTime(5);
        expect(valueSpy).not.toHaveBeenCalled();

        subject.next(2);
        jest.advanceTimersByTime(12);
        expect(valueSpy).toHaveBeenCalledWith(2);

        subscription.unsubscribe();
    });
});
