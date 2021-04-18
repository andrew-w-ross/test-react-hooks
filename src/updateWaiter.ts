import { act } from "react-test-renderer";
import type { Observable, SubscribableOrPromise } from "rxjs";
import { combineLatest, race, Subject } from "rxjs";
import {
    bufferCount,
    debounceTime,
    filter,
    map,
    publish,
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
    public actFn?: () => any | Promise<any>;
    public preActFn?: () => void;

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
        if (this.actFn != null) {
            console.warn(
                "actFn is already declared, overriding the current one",
            );
        }
        this.actFn = actFn;
        return this;
    }

    preAct(preActFn: () => void) {
        if (this.preActFn != null) {
            console.warn(
                "preActFn is already declared, overriding the current one",
            );
        }
        this.preActFn = preActFn;
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
        const updateObserver = publish<UpdateEvent>()(subject.asObservable());

        const waiter = new UpdateWaiter((resolve) => {
            resolve(deferredPromise);
        }, updateObserver);

        const execute = async () => {
            if (waiter.waiters.length === 0) {
                waiter.debounce();
            }

            const waitStream =
                waiter.waitMode === "all"
                    ? combineLatest(waiter.waiters)
                    : race(waiter.waiters);

            const errorStream = updateObserver.pipe(
                filter((v) => v.error != null),
                map((v) => {
                    throw v.error;
                }),
            );

            waiter.executed = true;
            const execution = race(errorStream, waitStream)
                .pipe(take(1))
                .toPromise();

            const actPromise = act(async () => {
                await waiter.actFn?.();
                await execution;
            });

            updateObserver.connect();
            waiter.preActFn?.();

            return actPromise;
        };

        Promise.resolve().then(() => executor.resolve(execute()));

        return waiter;
    };

    return {
        updateSubject: subject,
        createWaiter,
        clearSubject: () => {
            const observers = subject.observers.splice(0);
            observers.forEach((observer) => observer.complete());
        },
    };
}
