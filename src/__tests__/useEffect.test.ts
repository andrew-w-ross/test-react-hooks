import { createTestProxy } from "../createTestProxy";
import { useEffect } from "react";

const spyLeave = jest.fn();
const spy = jest.fn(() => spyLeave);

const [prxEffect, control] = createTestProxy(useEffect);

it("will call on mount", () => {
  prxEffect(spy, []);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spyLeave).not.toHaveBeenCalled();

  control.unmount();
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spyLeave).toHaveBeenCalledTimes(1);
});

it("will call on unmount", () => {
  prxEffect(spy);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spyLeave).not.toHaveBeenCalled();
});

it("will call on arg change", () => {
  prxEffect(spy, [1]);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spyLeave).not.toHaveBeenCalled();

  prxEffect(spy, [2]);
  expect(spy).toHaveBeenCalledTimes(2);
  expect(spyLeave).toHaveBeenCalledTimes(1);
});
