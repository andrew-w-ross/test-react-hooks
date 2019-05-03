import React, { createContext, useContext, FC } from "react";
import { useTestHook } from "../useTestHook";
import { useTestProxy } from "../useTestProxy";

const TestContext = createContext(0);

describe("useTestHook", () => {
  it("will get default value", () => {
    const { getResult } = useTestHook(() => useContext(TestContext), {
      context: TestContext
    });
    let result = getResult();
    expect(result).toBe(undefined);
  });

  it("will use initial value", () => {
    const { getResult } = useTestHook(() => useContext(TestContext), {
      context: TestContext,
      contextVal: 2
    });
    let result = getResult();
    expect(result).toBe(2);
  });

  it("will update context value", () => {
    const { getResult, setContextVal } = useTestHook(
      () => useContext(TestContext),
      { context: TestContext }
    );

    let result = getResult();
    expect(result).toBeUndefined();

    setContextVal(3);
    result = getResult();
    expect(result).toBe(3);
  });
});

describe("useTestProxy", () => {
  const Wrapper: FC<{ val: number }> = ({ val, children }) => (
    <TestContext.Provider value={val}>{children}</TestContext.Provider>
  );

  it("will get the default value", () => {
    const [prxContext] = useTestProxy(useContext);
    const res = prxContext(TestContext);
    expect(res).toBe(0);
  });

  it("will get the value from the above context", () => {
    const [prxContext, control] = useTestProxy(useContext, {
      wrapper: Wrapper,
      props: { val: 2 }
    });
    {
      const res = prxContext(TestContext);
      expect(res).toBe(2);
    }
    {
      control.props = { val: 3 };
      const res = prxContext(TestContext);
      expect(res).toBe(3);
    }
  });
});
