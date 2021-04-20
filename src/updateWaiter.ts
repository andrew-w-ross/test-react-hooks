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
 * Fluent api for
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

    act(actFn: () => any | Promise<any>) {
        if (this._actFn != null) {
            console.warn(
                "actFn is already defined, overriding the current one",
            );
        }
        this._actFn = actFn;
        return this;
    }

    debounce = (ms = 2) =>
        this.addWaiter((update$) =>
            update$.pipe(
                filter((v) => v.async === true),
                debounceTime(ms),
            ),
        );

    updateCount = (count = 1) =>
        this.addWaiter((update$) =>
            update$.pipe(
                filter((v) => v.async === true),
                bufferCount(count),
            ),
        );

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
