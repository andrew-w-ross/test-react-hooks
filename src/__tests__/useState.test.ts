import { useTestHook, useTestProxy } from "../";
import { useState, useEffect } from "react";

describe("useTestHook", () => {
  const leaveSpy = jest.fn();
  const spy = jest.fn(() => leaveSpy);
  const useCustomHook = () => {
    useEffect(spy);
    return useState(0);
  };

  it("can read useState", () => {
    const { getResult } = useTestHook(() => useState(1));
    let [count] = getResult();
    expect(count).toBe(1);
  });

  it("can update useState", () => {
    const { getResult } = useTestHook(() => useState(2));
    let [count] = getResult();
    expect(count).toBe(2);

    [count] = getResult(([, setCount]) => setCount(3));
    expect(count).toBe(3);
  });

  it("will not remove state on flushEffects", () => {
    const { getResult, flushEffects } = useTestHook(useCustomHook, {
      mountEager: false
    });

    let [count] = getResult();
    expect(count).toBe(0);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(leaveSpy).not.toHaveBeenCalled();

    [count] = getResult(([, setCount]) => setCount(1));
    expect(count).toBe(1);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(leaveSpy).toHaveBeenCalled();

    flushEffects();
    expect(count).toBe(1);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(leaveSpy).toHaveBeenCalledTimes(2);
  });
});

describe("useTestProxy", () => {
  const [prxState] = useTestProxy(useState);

  it("will get initial state", () => {
    const [count] = prxState(1);
    expect(count).toBe(1);
  });

  it("will update the state", () => {
    {
      const [, setCount] = prxState(1);
      setCount(2);
    }
    {
      const [count, setCount] = prxState(1);
      expect(count).toBe(2);
      setCount(3);
    }
    {
      const [count] = prxState(1);
      expect(count).toBe(3);
    }
  });

  it("can use the constructor function", () => {
    const spy = jest.fn(() => 2);
    const [count] = prxState(spy);

    expect(count).toBe(2);
    expect(spy).toHaveBeenCalled();
  });

  it("will apply all changes", () => {
    {
      const [count, setCount] = prxState(1);
      expect(count).toBe(1);
      setCount(2);
      setCount(3);
    }

    {
      const [count] = prxState(1);
      expect(count).toBe(3);
    }
  });
});
