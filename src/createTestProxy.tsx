import type { FC } from "react";
import type { ReactTestRenderer } from 'react-test-renderer';
import { act, create } from 'react-test-renderer';
import { ErrorBoundary } from "./ErrorBoundary";
import type { WrapApplyFn} from "./proxy";

import { wrapProxy } from "./proxy";
import { returnAct } from "./utils";

export type TestHook = (...args: any[]) => any;

const cleanUpFns: Function[] = [];

export function cleanUp() {  
  cleanUpFns.splice(0, cleanUpFns.length).forEach((func) => func());
}

if(!process.env.TEST_REACT_HOOKS_NO_CLEANUP)
  globalThis?.afterEach?.(cleanUp);

type TestHookProps = {
  callback: Function;  
};

function TestHook({ callback }: TestHookProps) {
  callback();  
  return null;
}

const DefaultWrapper: FC = ({ children }) => <>{children}</>;

/**
 * Function that will ensure a function and all it's returned memebers are wrapped in act
 */
const wrapApplyAct : WrapApplyFn = (...args) => returnAct(() => Reflect.apply(...args));

/**
 * Options for createTestProxy
 *
 * @export
 * @interface UseProxyOptions
 * @template TProps
 */
export interface UseProxyOptions<TProps> {
  /**
   * Component to wrap the test component in
   *
   * @type {React.ComponentType<TProps>}
   */
  wrapper?: React.ComponentType<TProps>;

  /**
   * Initial  props to render the wrapper component with
   */
  props?: TProps;
}
/**
 * Creates a proxy hook and a control object for that hook
 * Proxy hook will rerender when called and wrap
 * Calls in act when appropriate
 *
 * @export
 * @template THook
 * @template TProps
 * @param {THook} hook
 * @param {UseProxyOptions<TProps>} [options={}]
 * @returns {[THook, HookControl<TProps>]}
 */
export function createTestProxy<THook extends TestHook, TProps = any>(
  hook: THook,
  options: UseProxyOptions<TProps> = {}
) {
  const { wrapper: Wrapper = DefaultWrapper } = options;
  let { props: wrapperProps } = options;
  let reactTestRenderer : ReactTestRenderer | null = null;
  let result : ReturnType<TestHook> | undefined = undefined;
  const proxiedHook = wrapProxy(hook, wrapApplyAct);
  
  const resolvers: Function[] = [];
  function runResolvers() {
    resolvers.splice(0, resolvers.length).forEach(resolve => {
      resolve();
    });
  }

  function cleanup(){
    act(() => {
      if(reactTestRenderer){
        reactTestRenderer.unmount();
      }      
    });
    reactTestRenderer = null;    
  }  

  const render = (...params:Parameters<THook>) => {
    let caughtError: Error | null = null;
    const element = (
      <ErrorBoundary onError={error => {
        caughtError = error;
      }} >
      <Wrapper {...(wrapperProps ?? {} as TProps) }>
        <TestHook callback={() => {
          result = proxiedHook(...params);          
          runResolvers();
        }} />
      </Wrapper>
      </ErrorBoundary>
      );

    act(() => {
      if(reactTestRenderer == null){
        reactTestRenderer = create(element);
        cleanUpFns.push(cleanup);
      } else {
        reactTestRenderer.update(element);
      }
    });

    if(caughtError){
      throw caughtError;
    }

    return result;
  };  

  const control = {
    unmount: () => {
      act(() => {
        reactTestRenderer?.unmount();
      });
    },    
    set props(newValue: TProps) {
      wrapperProps = newValue;
    },    
    waitForNextUpdate: () => {
      return new Promise<void>(resolve => resolvers.push(resolve))
    }      
  };

  return [render as THook, control] as const;
}