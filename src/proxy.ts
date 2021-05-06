import { isPromiseLike } from "./utils";

function isPrimitive(value: any) {
    if (value == null) return true;

    if (value instanceof Date) return true;

    return typeof value !== "function" && typeof value !== "object";
}

/**
 * Describes a function that will take a target and then have a callback that does something to the target
 */
export type WrapApplyFn = (
    target: any,
    thisArg: any,
    argumentsList: any[],
) => any;

//TODO : Add a shallow option that doesn't wrap arguments and promise results
export function wrapProxy<T>(target: T, wrapFn: WrapApplyFn): T {
    if (isPromiseLike(target)) {
        return target;
        //return target.then((result) => wrapProxy(result, wrapFn));
    }

    return isPrimitive(target)
        ? target
        : new Proxy(target, createHandler(wrapFn));
}

export function createHandler(wrapFn: WrapApplyFn): ProxyHandler<any> {
    return {
        get(target: any, property: any, receiver: any) {
            const descriptor = Reflect.getOwnPropertyDescriptor(
                target,
                property,
            );
            const result = Reflect.get(target, property, receiver);

            return descriptor && descriptor.configurable
                ? wrapProxy(result, wrapFn)
                : result;
        },
        apply(target: any, thisArg: any, argumentsList: any[]) {
            argumentsList.forEach((arg) => wrapProxy(arg, wrapFn));
            return wrapProxy(wrapFn(target, thisArg, argumentsList), wrapFn);
        },
    };
}
