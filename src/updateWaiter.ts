import { act } from "react-test-renderer";
import type {
    ConnectableObservable,
    Observable,
    SubscribableOrPromise,
} from "rxjs";
import { combineLatest, race, Subject } from "rxjs";
import {
    bufferCount,
    debounceTime,
    filter,
    map,
    publishReplay,
    take,
} from "rxjs/operators";
import { promiseWithExternalExecutor } from "./utils";

/**
 * What wait mode to use for multiple promises, @see Promise.race or @see Promise.all
 */
export type WaitMode = "race" | "all";

export type UpdateEvent =
    | { async: boolean; error?: undefined }
    | { error: Error; async?: undefined };

export class AlreadyExecutedError extends Error {
    constructor() {
        super("Already executed");
    }
}

/**
 * UpdateWaiter is a fluent api that will resolve when it's conditions are met.
 */
export class UpdateWaiter extends Promise<void> {
    public executed = false;
    public waiters: SubscribableOrPromise<any>[] = [];
    public waitMode: WaitMode = "all";
    public _actFn?: () => any | Promise<any>;

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
     * ```typescript
     * //Wait for 10ms
     * createWaiter().addWaiter((updateObserver) => new Promise((resolve) => setTimeout(resolve, 10)));
     * ```
     */
    addWaiter(
        waitFn: (
            updateObserver: Observable<UpdateEvent>,
        ) => SubscribableOrPromise<any>,
    ) {
        if (this.updateObserver == null || this.executed)
            throw new AlreadyExecutedError();

        this.waiters.push(waitFn(this.updateObserver));

        return this;
    }

    /**
     * Function that is called before waiting starts, wrapper in act.
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
    debounce = (ms = 2) =>
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
     * If there is more than one condition how should they be handled
     * @param mode - is either the string 'race' or 'all' if 'race' will wait for one to resolve if 'all' waits for all to resolve.
     */
    iterationMode(mode: WaitMode) {
        this.waitMode = mode;
        return this;
    }
}

/**
 * Creates the subject and the waiter function for
 * @returns
 */
export function createWaitForNextUpdate() {
    const subject = new Subject<UpdateEvent>();
    const createWaiter = () => {
        const {
            executor,
            promise: deferredPromise,
        } = promiseWithExternalExecutor<void>();

        const update$ = subject.pipe(
            publishReplay(),
        ) as ConnectableObservable<UpdateEvent>;
        const subscription = update$.connect();

        const waiter = new UpdateWaiter((resolve) => {
            resolve(act(() => deferredPromise));
        }, update$);

        const execute = async () => {
            await Promise.resolve();

            if (waiter.waiters.length === 0) {
                waiter.debounce();
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
            await race(error$, wait$).pipe(take(1)).toPromise();
            subscription.unsubscribe();
        };

        executor.resolve(execute());

        return waiter;
    };

    return {
        updateSubject: subject,
        createWaiter,
    };
}
