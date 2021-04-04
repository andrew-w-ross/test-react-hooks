import { combineLatest, NEVER, race, Subject, zip } from "rxjs";
import { bufferCount, debounceTime, take } from "rxjs/operators";

/**
 * This sanity check file in general might seem a bit silly but there is a lot
 * of specific behavior that must hold true for the rest of this library to work.
 * Hopefully these tests will work as a canary in a coal mine if the behavior for rxjs changes.
 *
 * Lessons learned
 */

afterEach(() => {
    jest.useRealTimers();
});

const subject = new Subject<number>();
const resolveSpy = jest.fn();

it("toPromise will resolve with queueMicrotask", async () => {
    subject.pipe(take(1)).toPromise().then(resolveSpy);

    subject.next(1);
    expect(resolveSpy).not.toHaveBeenCalled();

    queueMicrotask(() => {
        expect(resolveSpy).toHaveBeenCalledWith(1);
    });
});

it("toPromise will resolve with process.nextTick", (done) => {
    subject.pipe(take(1)).toPromise().then(resolveSpy);

    subject.next(2);
    expect(resolveSpy).not.toHaveBeenCalled();

    process.nextTick(() => {
        expect(resolveSpy).toHaveBeenCalledWith(2);
        done();
    });
});

//We can assume setTimeout will work after this point
it("toPromise will resolve with setImmediate", (done) => {
    subject.pipe(take(1)).toPromise().then(resolveSpy);

    subject.next(3);
    expect(resolveSpy).not.toHaveBeenCalled();

    setImmediate(() => {
        expect(resolveSpy).toHaveBeenCalledWith(3);
        done();
    });
});

it("toPromise will resolve with an await", async () => {
    subject.pipe(take(1)).toPromise().then(resolveSpy);

    subject.next(4);
    expect(resolveSpy).not.toHaveBeenCalled();

    await undefined; //Same as await Promise.resolve();
    expect(resolveSpy).toHaveBeenCalledWith(4);
});

it("debounceTime in legacy timers needs an await to resolve", async () => {
    jest.useFakeTimers("legacy");
    subject.pipe(debounceTime(10)).pipe(take(1)).toPromise().then(resolveSpy);

    subject.next(5);
    expect(resolveSpy).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();
    expect(resolveSpy).not.toHaveBeenCalled();

    await undefined;
    expect(resolveSpy).toHaveBeenCalledWith(5);
});

it("debounceTime in modern timers needs an await to resolve", async () => {
    jest.useFakeTimers("modern");
    subject.pipe(debounceTime(10)).pipe(take(1)).toPromise().then(resolveSpy);

    subject.next(5);
    expect(resolveSpy).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();
    expect(resolveSpy).not.toHaveBeenCalled();

    await undefined;
    expect(resolveSpy).toHaveBeenCalledWith(5);
});

it("will do some stuff", () => {
    const valueSpy = jest.fn();
    const errorSpy = jest.fn();
    const completeSpy = jest.fn();

    const countObs = subject.asObservable().pipe(bufferCount(2));

    const obs = race(combineLatest([countObs]), NEVER).pipe(take(1));

    obs.subscribe(valueSpy, errorSpy, completeSpy);

    expect(valueSpy).not.toHaveBeenCalledWith();

    subject.next(1);
    subject.next(2);

    expect(valueSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy).toHaveBeenCalled();
});
