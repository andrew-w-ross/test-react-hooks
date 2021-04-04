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
    publish,
    take,
} from "rxjs/operators";

/**
 * What wait mode to use for multiple promises, @see Promise.race or @see Promise.all
 */
export type WaitMode = "race" | "all";

export type UpdateEvent =
    | { async: boolean; error?: undefined }
    | { error: Error; async?: undefined };

export type CustomWaitArgs = {
    /**
     * Observer that gets all the updates
     */
    updateObserver: Observable<UpdateEvent>;
    /**
     * Convenience observer, the @see updateObserver with the filter for async === true.
     */
    asyncObserver: Observable<UpdateEvent>;
};

export class UpdateWaiter implements PromiseLike<void> {
    private updateObserver: ConnectableObservable<UpdateEvent>;
    private asyncObserver: Observable<UpdateEvent>;
    private errorObserver: Observable<void>;
    private waiters: SubscribableOrPromise<any>[] = [];
    private waitMode: WaitMode = "all";
    private actFn?: () => any;
    private postActFn?: () => any;
    private executePromise?: Promise<void>;

    constructor(inputObservable: Observable<UpdateEvent>) {
        //@ts-expect-error
        this.updateObserver = publish()(inputObservable);

        this.asyncObserver = this.updateObserver.pipe(
            filter((v) => v.async === true),
        );
        this.errorObserver = this.updateObserver.pipe(
            filter((v) => v.error != null),
            map((v) => {
                throw v.error;
            }),
        );
    }

    get hasExecuted() {
        return this.executePromise != null;
    }

    private checkCallState() {
        if (this.hasExecuted)
            throw new Error(
                `Waiter has already executed. Add wait rules synchronously, the rules themselves are allowed to be async.`,
            );
    }

    private async execute() {
        //No promises added, default to debounce.
        if (this.waiters.length === 0) {
            this.debounce();
        }

        const waitStream =
            this.waitMode === "all"
                ? combineLatest(this.waiters)
                : race(this.waiters);

        const executePromise = race(this.errorObserver, waitStream)
            .pipe(take(1))
            .toPromise();

        this.updateObserver.connect();

        const actPromise = act(async () => {
            await this.actFn?.();
            await executePromise;
        });

        this.postActFn?.();
        return actPromise;
    }

    get then() {
        //To replicate a promise start an execution before then is called.
        //Be super careful when changing this, it matter when await is involved
        this.executePromise = this.execute();
        return <TResult1 = void, TResult2 = never>(
            onfulfilled?:
                | ((value: void) => TResult1 | PromiseLike<TResult1>)
                | null,
            onrejected?:
                | ((reason: any) => TResult2 | PromiseLike<TResult2>)
                | null,
        ): PromiseLike<TResult1 | TResult2> => {
            //This is kinda sneaky but makes this so much easier to use
            return this.executePromise!.then(onfulfilled, onrejected);
        };
    }

    timerFn(fn: () => any) {
        this.checkCallState();
        this.postActFn = fn;
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

    debounce(ms = 2): this {
        this.checkCallState();
        const debounceObserver = this.asyncObserver.pipe(debounceTime(ms));

        this.waiters.push(debounceObserver);

        return this;
    }

    updateCount(count = 1) {
        this.checkCallState();
        const bufferObserver = this.asyncObserver.pipe(bufferCount(count));

        this.waiters.push(bufferObserver);

        return this;
    }

    customWait(
        waitFn: (waitArgs: CustomWaitArgs) => SubscribableOrPromise<any>,
    ) {
        this.checkCallState();

        const waitArgs: CustomWaitArgs = {
            asyncObserver: this.asyncObserver,
            updateObserver: this.updateObserver,
        };
        this.waiters.push(waitFn(waitArgs));

        return this;
    }

    race() {
        this.checkCallState();
        this.waitMode = "race";
        return this;
    }

    all() {
        this.checkCallState();
        this.waitMode = "all";
        return this;
    }
}

/**
 * Creates the subject and the waiter function for
 * @returns
 */
export function createWaitForNextUpdate() {
    const subject = new Subject<UpdateEvent>();
    const waitForNextUpdate = () => new UpdateWaiter(subject.asObservable());

    return {
        updateSubject: subject,
        waitForNextUpdate,
        clearSubject: () => {
            const observers = subject.observers.splice(0);
            observers.forEach((observer) => observer.complete());
        },
    };
}
