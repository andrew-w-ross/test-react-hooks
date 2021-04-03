import type { Subscription, SubscriptionObserver } from "zen-observable";
import Observable from "zen-observable";
import { removeIfExists } from "./utils";

export class Subject<T> implements SubscriptionObserver<T> {
    private observers: SubscriptionObserver<T>[] = [];

    get closed() {
        return false;
    }
    next(value: T): void {
        this.observers.forEach((obs) => obs.next(value));
    }
    error(errorValue: any): void {
        this.observers.forEach((obs) => obs.error(errorValue));
    }
    complete(): void {
        this.observers.forEach((obs) => obs.complete());
    }

    getObservable(): Observable<T> {
        const observable = new Observable<T>((observer) => {
            this.observers.push(observer);
            return () => {
                removeIfExists(this.observers, observer);
            };
        });

        return observable;
    }

    cleanUp() {
        this.complete();
    }
}

export function debounce<T>(source: Observable<T>, ms: number) {
    return new Observable<T>((observer) => {
        let timeOutHandle: any = null;
        const onValue = (value: T) => {
            if (timeOutHandle != null) {
                clearTimeout(timeOutHandle);
            }
            timeOutHandle = setTimeout(() => {
                observer.next(value);
            }, ms);
        };

        const subscription = source.subscribe(
            onValue,
            observer.error,
            observer.complete,
        );

        return () => subscription;
    });
}

export function take<T>(source: Observable<T>, count: number) {
    return new Observable<T[]>((observer) => {
        const values: T[] = [];
        const onValue = (value: T) => {
            values.push(value);
            if (values.length >= count) {
                observer.next(values);
            }
        };

        const subscription = source.subscribe(
            onValue,
            observer.error,
            observer.complete,
        );

        return () => subscription;
    });
}

export function toPromise<T>(source: Observable<T>) {
    let subscription: Subscription | null = null;

    return new Promise<T | null>((resolve, reject) => {
        subscription = source.subscribe(resolve, reject, () => resolve(null));
    }).finally(() => {
        subscription?.unsubscribe();
    });
}
