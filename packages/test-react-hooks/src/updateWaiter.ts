import { act } from "react-test-renderer";
import type { Observable, ObservableInput } from "rxjs";
import {
    combineLatest,
    connectable,
    firstValueFrom,
    race,
    ReplaySubject,
    Subject,
} from "rxjs";
import { bufferCount, debounceTime, filter, map, take } from "rxjs/operators";
import { DEFAULT_OPTIONS } from "./createTestProxy";
import type { UpdateEvent } from "./models";
import { AlreadyExecutedError } from "./models";
import { promiseWithExternalExecutor } from "./utils";

/**
 * What wait mode to use for multiple promises, @see Promise.race or @see Promise.all
 */
export type WaitMode = "race" | "all";

/**
 * UpdateWaiter is a fluent api that will resolve when it's conditions are met.
 */
export class UpdateWaiter extends Promise<void> {
    /** @internal */
    public executed = false;
    /** @internal */
    public waiters: ObservableInput<any>[] = [];
    /** @internal */
    public waitMode: WaitMode = "all";
    /** @internal */
    public _actFn?: () => any | Promise<any>;

    /** @internal */
    constructor(
        executor: (
            resolve: (value: void | PromiseLike<void>) => void,
            reject: (reason?: any) => void,
        ) => void,
        private updateObserver: Observable<UpdateEvent>,
    ) {
        super(executor);
    }

    /**
     * @param waitFn function that takes in an {Observable<UpdateEvent>} and returns an {Observable<any>} or a {Promise}
     * @example
     * //Wait for 10ms
     * createWaiter().addWaiter((updateObserver) => new Promise((resolve) => setTimeout(resolve, 10)));
     */
    addWaiter(
        waitFn: (
            updateObserver: Observable<UpdateEvent>,
        ) => ObservableInput<any>,
    ) {
        if (this.updateObserver == null || this.executed)
            throw new AlreadyExecutedError();

        this.waiters.push(waitFn(this.updateObserver));

        return this;
    }

    /**
     * Function that is called before waiting starts, wrapped in act.
     * @param actFn
     */
    act(actFn: () => any | Promise<any>) {
        if (this._actFn != null) {
            console.warn(
                "actFn is already defined, overriding the current one",
            );
        }
        this._actFn = actFn;
        return this;
    }

    /**
     * Waits for the updates to stop for a certain amount of time before stopping.
     * @param ms - Time to wait in ms
     */
    debounce = (ms = 3) =>
        this.addWaiter((update$) =>
            update$.pipe(
                filter((v) => v.async === true),
                debounceTime(ms),
            ),
        );

    /**
     * Waits for a certain amount of updates before resolving.
     * @param count - Amount of update to wait for.
     */
    updateCount = (count = 1) =>
        this.addWaiter((update$) =>
            update$.pipe(
                filter((v) => v.async === true),
                bufferCount(count),
            ),
        );

    /**
     * Waits for all of the waiters to resolve before resolving
     */
    waitAll() {
        this.waitMode = "all";
        return this;
    }

    /**
     * Waits for one of the waiters to resolve before resolving
     */
    waitRace() {
        this.waitMode = "race";
        return this;
    }
}

/**
 * Creates the subject and the waiter function for
 * @returns
 */
export function createUpdateStream() {
    const subject = new Subject<UpdateEvent>();

    function hoistError<TResult>(fn: () => TResult) {
        let caughtError: unknown = null;
        const subscription = subject
            .pipe(
                filter((update) => update.error != null),
                take(1),
            )
            .subscribe({
                next(err) {
                    caughtError = err.error;
                },
            });

        const result = fn();
        subscription.unsubscribe();
        if (caughtError) {
            throw caughtError;
        }

        return result;
    }

    function createWaiter() {
        const { executor, promise: deferredPromise } =
            promiseWithExternalExecutor<void>();

        const update$ = connectable(subject, {
            connector: () => new ReplaySubject<UpdateEvent>(),
            resetOnDisconnect: false,
        });
        const subscription = update$.connect();

        const waiter = new UpdateWaiter((resolve) => {
            resolve(act(() => deferredPromise));
        }, update$);

        const execute = async () => {
            await Promise.resolve();

            if (waiter.waiters.length === 0) {
                DEFAULT_OPTIONS.waiterDefault(waiter);
            }
            waiter.executed = true;

            const wait$ =
                waiter.waitMode === "all"
                    ? combineLatest(waiter.waiters)
                    : race(waiter.waiters);

            const error$ = update$.pipe(
                filter((v) => v.error != null),
                map((v) => {
                    throw v.error;
                }),
            );

            await waiter._actFn?.();
            await firstValueFrom(race(error$, wait$));
            subscription.unsubscribe();
        };

        executor.resolve(execute());

        return waiter;
    }

    return {
        updateSubject: subject,
        createWaiter,
        hoistError,
    };
}
