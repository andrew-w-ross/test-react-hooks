import { useTestHook, cleanUp } from "../useTestHook";
import { useState, useEffect } from "react";

const leaveSpy = jest.fn();
const spy = jest.fn(() => leaveSpy);
const customHook = () => {
  useEffect(spy);
  return useState(0);
};

afterEach(cleanUp);

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
  const { getResult, flushEffects } = useTestHook(customHook, {
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
