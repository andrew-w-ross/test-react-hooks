import React, { Context, createContext, FC } from "react";
import ReactDom from "react-dom";
//@ts-ignore
import { act } from "react-dom/test-utils";

const DefaultContext = createContext<unknown>({});
const TEST_ID = "__useTests_hook_component";

let container: HTMLElement | null = null;

/**
 * Function to be called after your tests to cleanup the container created
 *
 * @export
 */
export function cleanUp() {
  container = null;
  const elem = document.getElementById(TEST_ID);
  if (elem != null) {
    elem.remove();
  }
}

function ensureContainer() {
  if (container != null) {
    console.warn(
      "Previous tests weren't cleaned up, use the cleanUp command after each test"
    );
    cleanUp();
  }
  container = document.createElement("div");
  container.id = TEST_ID;
  document.body.appendChild(container);
}

type TestCompProps = {
  callBack: () => unknown;
  val: number;
};

export type TestHookOptions<TConVal> = {
  /**
   * Optional context to render the hook in
   * @type {Context<TConVal>}
   */
  context?: Context<TConVal>;
  /**
   * Initial context value for the provided context
   * @type {TConVal}
   */
  contextVal?: TConVal;

  /**
   * Should it mount straight away or when needed?
   * @type {boolean}
   */
  mountEager?: boolean;
};

export type HookState<TRes, TConVal> = {
  /**
   * Gets the current result of the hook
   */
  getResult: (updateFn?: UpdateFn<TRes>) => TRes;
  /**
   * Unmounts the component the hook is in
   */
  unmount: () => boolean;
  /**
   * Mounts the test component the hook is in
   */
  mount: () => void;
  /**
   * Forces a useEffect to unsubscribe and fire again
   */
  flushEffects: () => void;
  /**
   * Sets the value of the context
   */
  setContextVal: (value: TConVal) => void;

  /**
   * Element that the test component is mounted on, use with caution
   *
   * @type {HTMLElement}
   */
  container: HTMLElement;
};

export type UpdateFn<TRes> = (res: TRes) => any;

/**
 * Entry point for the test-react-hooks library.
 *
 * @export
 * @template TRes Result type of the hook
 * @template TConVal Value of the context
 * @param {() => TRes} setupFn function that sets up your hook and returns its values
 * @param {TestHookOptions<TConVal>} [options={}]
 * @returns {HookState<TRes, TConVal>} object that then controls the current hook state
 */
export function useTestHook<TRes, TConVal = unknown>(
  setupFn: () => TRes,
  options: TestHookOptions<TConVal> = {}
): HookState<TRes, TConVal> {
  let { contextVal } = options;
  const { context: TestContext = DefaultContext, mountEager = false } = options;

  let res: TRes;
  let val = 0;

  const testCallBack = () => {
    res = setupFn();
  };

  const TestComp: FC<TestCompProps> = ({ val, callBack }) => {
    return (
      <>
        {val}
        {callBack()}
      </>
    );
  };

  const renderComp = (updateFn?: UpdateFn<TRes>) =>
    act(() => {
      if (updateFn) {
        updateFn(res);
      }
      ReactDom.render(
        //@ts-ignore
        <TestContext.Provider value={contextVal}>
          <TestComp val={val} callBack={testCallBack} />
        </TestContext.Provider>,
        container
      );
    });

  ensureContainer();
  if (mountEager) renderComp();

  return {
    getResult: (updateFn?: UpdateFn<TRes>) => {
      renderComp(updateFn);
      return res;
    },
    unmount: () => {
      if (container != null) {
        ReactDom.unmountComponentAtNode(container);
      }
      return false;
    },
    mount: () => {
      renderComp();
    },
    flushEffects: () => {
      val++;
      renderComp();
    },
    setContextVal: (value: TConVal) => {
      contextVal = value;
      renderComp();
    },
    container: container!
  };
}
