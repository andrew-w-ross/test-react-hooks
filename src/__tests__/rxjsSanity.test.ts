import type { ConnectableObservable } from "rxjs";
import { Subject } from "rxjs";
import { debounceTime, publish, publishReplay, take } from "rxjs/operators";

/**
 * This sanity check file in general might seem a bit silly but there is a lot
 * of specific behavior that must hold true for the rest of this library to work.
 * Hopefully these tests will work as a canary in a coal mine if the behavior for rxjs changes.
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

    await undefined;
    expect(resolveSpy).toHaveBeenCalledWith(4);
});

it("debounceTime in legacy timers needs an await to resolve", async () => {
    jest.useFakeTimers("legacy");
    subject.pipe(debounceTime(10)).pipe(take(1)).toPromise().then(resolveSpy);

    subject.next(5);
    expect(resolveSpy).not.toHaveBeenCalled();

    await jest.runOnlyPendingTimers();
    expect(resolveSpy).toHaveBeenCalledWith(5);
});

it("debounceTime in modern timers needs an await to resolve", async () => {
    jest.useFakeTimers("modern");
    subject.pipe(debounceTime(10)).pipe(take(1)).toPromise().then(resolveSpy);

    subject.next(5);
    expect(resolveSpy).not.toHaveBeenCalled();

    await jest.runOnlyPendingTimers();
    expect(resolveSpy).toHaveBeenCalledWith(5);
});

it("publish will not emit until connect is called", () => {
    const nextSpy = jest.fn();

    const connect$ = subject.pipe(publish()) as ConnectableObservable<number>;
    connect$.subscribe({
        next: nextSpy,
    });

    subject.next(1);
    expect(nextSpy).not.toHaveBeenCalled();

    const subscription = connect$.connect();
    subject.next(2);
    expect(nextSpy).toHaveBeenCalledWith(2);

    subscription.unsubscribe();
    subject.next(3);
    expect(nextSpy).not.toHaveBeenCalledWith(3);
});

it("publishReplay will replay with connected", () => {
    const nextSpy = jest.fn();

    const replay$ = subject
        .asObservable()
        .pipe(publishReplay()) as ConnectableObservable<number>;

    const subscription = replay$.connect();

    subject.next(1);
    subject.next(2);
    subject.next(3);

    replay$.subscribe({
        next: nextSpy,
    });

    expect(nextSpy).toHaveBeenCalledTimes(3);

    subscription.unsubscribe();

    subject.next(4);
    expect(nextSpy).not.toHaveBeenCalledWith(4);
});
