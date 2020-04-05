import { createTestProxy } from "../";
import { useState } from "react";

const [prxState] = createTestProxy(useState);

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

it("will work with date", () => {
  const initial = new Date("2019-01-01 12:33:12");
  const [res] = prxState(initial);
  expect(res).toEqual(initial);
});
