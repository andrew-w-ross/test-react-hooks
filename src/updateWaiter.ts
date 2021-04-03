import { act } from "react-test-renderer";
import type Observable from "zen-observable";
import { debounce, Subject, take, toPromise } from "./observer-utils";
import { noOp } from "./utils";

/**
 * What wait mode to use for multiple promises, @see Promise.race or @Promise.all
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
    private hasExecuted = false;
    private asyncObserver: Observable<UpdateEvent>;
    private promises: Promise<any>[] = [];
    private waitMode: WaitMode = "all";
    private isErrorSwalling = false;
    private postActFn: () => any = noOp;

    constructor(private updateObserver: Observable<UpdateEvent>) {
        this.asyncObserver = updateObserver.filter((v) => !!v.async);
    }

    then<TResult1 = void, TResult2 = never>(
        onfulfilled?:
            | ((value: void) => TResult1 | PromiseLike<TResult1>)
            | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): PromiseLike<TResult1 | TResult2> {
        return this.execute().then(onfulfilled, onrejected);
    }

    private checkCallState() {
        if (this.hasExecuted)
            throw new Error(
                `Waiter has already executed. Add wait rules synchronously, the rules themselves are allowed to be async.`,
            );
    }

    timerFn(fn: () => any) {
        this.checkCallState();
        this.postActFn = fn;
        return this;
    }

    private execute() {
        //No promises added, default to debounce.
        if (this.promises.length === 0) {
            this.debounce();
        }

        if (this.isErrorSwalling) {
            this.promises = this.promises.map((p) => p.catch());
        }

        const executePromise =
            this.waitMode === "all"
                ? Promise.all(this.promises)
                : Promise.race(this.promises);

        const actPromise = act(() => executePromise.then(() => {}));
        this.postActFn();
        return actPromise;
    }

    debounce(ms = 2): this {
        this.checkCallState();

        //Gotcha, specifically need to state first because the way toPromise works is from complete events.
        const deboucePromise = toPromise(debounce(this.asyncObserver, ms));

        this.promises.push(deboucePromise);

        return this;
    }

    updateCount(count = 2): this {
        this.checkCallState();

        const countPromise = toPromise(take(this.asyncObserver, count));

        this.promises.push(countPromise);

        return this;
    }

    customWait(waitFn: (waitArgs: CustomWaitArgs) => Promise<any>): this {
        this.checkCallState();

        const waitArgs: CustomWaitArgs = {
            asyncObserver: this.asyncObserver,
            updateObserver: this.updateObserver,
        };
        this.promises.push(waitFn(waitArgs));

        return this;
    }

    race(): this {
        this.checkCallState();
        this.waitMode = "race";
        return this;
    }

    all(): this {
        this.checkCallState();
        this.waitMode = "all";
        return this;
    }

    swallowErrors(): this {
        this.checkCallState();
        this.isErrorSwalling = true;
        return this;
    }
}

/**
 * Creates the subject and the waiter function for
 * @returns
 */
export function createWaitForNextUpdate() {
    const subject = new Subject<UpdateEvent>();
    const waitForNextUpdate = () => new UpdateWaiter(subject.getObservable());
    return {
        updateSubject: subject,
        waitForNextUpdate,
    };
}
