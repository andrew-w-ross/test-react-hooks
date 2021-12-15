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

export function wrapProxy<T>(target: T, wrapFn: WrapApplyFn): T {
    if (isPromiseLike(target)) {
        return target;
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
            return wrapProxy(wrapFn(target, thisArg, argumentsList), wrapFn);
        },
    };
}
