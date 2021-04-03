//Taken from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/zen-observable/index.d.ts
//Can't handle polluting the global scope unless it's defined from libs

//TODO : Remove zen-observable and polyfill when approved
declare global {
    interface SymbolConstructor {
        readonly observable: symbol;
    }
}

export interface SubscriptionObserver<T> {
    closed: boolean;
    next(value: T): void;
    error(errorValue: any): void;
    complete(): void;
}

export interface Subscription {
    closed: boolean;
    unsubscribe(): void;
}

export interface Observer<T> {
    start?(subscription: Subscription): any;
    next?(value: T): void;
    error?(errorValue: any): void;
    complete?(): void;
}

export interface Subscriber<T> {
    (observer: SubscriptionObserver<T>): void | (() => void) | Subscription;
}

export interface ObservableLike<T> {
    subscribe?: Subscriber<T>;
    [Symbol.observable](): Observable<T> | ObservableLike<T>;
}

export default class Observable<T> {
    constructor(subscriber: Subscriber<T>);

    subscribe(observer: Observer<T>): Subscription;
    subscribe(
        onNext: (value: T) => void,
        onError?: (error: any) => void,
        onComplete?: () => void,
    ): Subscription;

    [Symbol.observable](): Observable<T>;

    forEach(callback: (value: T) => void): Promise<void>;
    map<R>(callback: (value: T) => R): Observable<R>;
    filter<S extends T>(callback: (value: T) => value is S): Observable<S>;
    filter(callback: (value: T) => boolean): Observable<T>;
    reduce(
        callback: (previousValue: T, currentValue: T) => T,
        initialValue?: T,
    ): Observable<T>;
    reduce<R>(
        callback: (previousValue: R, currentValue: T) => R,
        initialValue?: R,
    ): Observable<R>;
    flatMap<R>(callback: (value: T) => ObservableLike<R>): Observable<R>;
    concat<R>(...observable: Array<Observable<R>>): Observable<R>;

    static from<R>(
        observable: Observable<R> | ObservableLike<R> | ArrayLike<R>,
    ): Observable<R>;
    static of<R>(...items: R[]): Observable<R>;
}
