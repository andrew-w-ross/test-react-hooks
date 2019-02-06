import { useTestHook, cleanUp } from "../useTestHook";
import { useLayoutEffect } from "react";

const spyLeave = jest.fn();
const spy = jest.fn(() => spyLeave);

afterEach(cleanUp);

it("will fires enter on mount", () => {
  useTestHook(() => useLayoutEffect(spy));

  expect(spy).toBeCalledTimes(1);
  expect(spyLeave).not.toHaveBeenCalled();
});

it("will fire on leave on unmount", () => {
  const { unmount } = useTestHook(() => useLayoutEffect(spy));
  expect(spy).toBeCalledTimes(1);
  expect(spyLeave).not.toHaveBeenCalled();

  unmount();
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spyLeave).toHaveBeenCalledTimes(1);
});

it("will enter, leave and enter on unmount, remount", () => {
  const { unmount, mount } = useTestHook(() => useLayoutEffect(spy));
  expect(spy).toBeCalledTimes(1);
  expect(spyLeave).not.toHaveBeenCalled();

  unmount();
  expect(spy).toBeCalledTimes(1);
  expect(spyLeave).toHaveBeenCalledTimes(1);

  mount();
  expect(spy).toBeCalledTimes(2);
  expect(spyLeave).toHaveBeenCalledTimes(1);
});

it("will enter, leave and enter on update", () => {
  const { flushEffects } = useTestHook(() => useLayoutEffect(spy));
  expect(spy).toBeCalledTimes(1);
  expect(spyLeave).not.toHaveBeenCalled();

  flushEffects();
  expect(spy).toBeCalledTimes(2);
  expect(spyLeave).toHaveBeenCalledTimes(1);
});
