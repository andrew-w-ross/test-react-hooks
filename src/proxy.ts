function isPrimitive(value: any) {
  if (value == null) return true;

  if (value instanceof Date) return true;

  return typeof value !== "function" && typeof value !== "object";
}

export type WrapFn = (target: any, cb: () => void) => any;

export function wrapProxy<T>(target: T, wrapFn: WrapFn): T {
  return isPrimitive(target)
    ? target
    : new Proxy(target, createHandler(wrapFn));
}

export function createHandler(wrapFn: WrapFn): ProxyHandler<any> {
  return {
    get(target: any, property: any, receiver: any) {
      const descriptor = Reflect.getOwnPropertyDescriptor(target, property);
      const result = Reflect.get(target, property, receiver);

      return descriptor && descriptor.configurable
        ? wrapProxy(result, wrapFn)
        : result;
    },
    apply(target: any, thisArg: any, argumentsList: any) {
      let result;
      wrapFn(target, () => {
        result = Reflect.apply(target, thisArg, argumentsList);
      });
      return wrapProxy(result, wrapFn);
    }
  };
}
