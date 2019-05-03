import React, { FC } from "react";
import { act } from "react-dom/test-utils";
import ReactDOM from "react-dom";
import { getContainer, unmount } from "./utils";

function isPrimitive(value: any) {
  if (value == null) return true;

  return typeof value !== "function" && typeof value !== "object";
}

type ApplyArgs = {
  target: any;
  thisArg: any;
  argumentsList?: any;
};

type WrapFn = (applyArgs: ApplyArgs, cb: () => void) => any;

function reactProxy<T>(target: T, wrapFn: WrapFn): T {
  return isPrimitive(target)
    ? target
    : new Proxy(target, createHandler(wrapFn));
}

function createHandler(wrapFn: WrapFn): ProxyHandler<any> {
  return {
    get(target: any, property: any, receiver: any) {
      const descriptor = Reflect.getOwnPropertyDescriptor(target, property);
      const result = Reflect.get(target, property, receiver);

      return descriptor && descriptor.configurable
        ? reactProxy(result, wrapFn)
        : result;
    },
    apply(target: any, thisArg: any, argumentsList: any) {
      let result;
      wrapFn({ target, thisArg, argumentsList }, () => {
        result = Reflect.apply(target, thisArg, argumentsList);
      });
      return reactProxy(result, wrapFn);
    }
  };
}

type TestHookProps = {
  callback: Function;
  children: Function;
};

function TestHook({ callback, children }: TestHookProps) {
  callback();
  children();
  return null;
}

const DefaultWrapper: FC = ({ children }) => <>{children}</>;

export type UseProxyOptions<P> = {
  wrapper?: React.ComponentType<P>;
  props?: P;
};

export function useTestProxy<T, P = any>(
  hook: T,
  options: UseProxyOptions<P> = {}
) {
  let { wrapper: Wrapper = DefaultWrapper, props = {} } = options;
  const resolvers: Function[] = [];
  function runResolvers() {
    resolvers.splice(0, resolvers.length).forEach(resolve => resolve());
  }

  const wrapFn: WrapFn = ({ target }, applyFn) => {
    act(() => {
      if (target === hook) {
        ReactDOM.render(
          //@ts-ignore
          <Wrapper {...props}>
            <TestHook callback={applyFn}>{runResolvers}</TestHook>
          </Wrapper>,
          getContainer()
        );
      } else {
        applyFn();
      }
    });
  };

  const control = {
    unmount,
    set props(newValue: P) {
      props = newValue;
    },
    get container() {
      //Should proxy and add act to all calls here
      return getContainer();
    },
    waitForNextUpdate: () =>
      new Promise<void>(resolve => resolvers.push(resolve))
  };

  return [reactProxy(hook, wrapFn), control] as const;
}
