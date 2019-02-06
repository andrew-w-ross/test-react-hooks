import { useTestHook, cleanUp } from "../useTestHook";
import { useEffect } from "react";

const spyLeave = jest.fn();
const spy = jest.fn(() => spyLeave);

afterEach(cleanUp);

it("will call on mount", () => {
  useTestHook(() => useEffect(spy), { mountEager: true });

  expect(spy).toBeCalledTimes(1);
  expect(spyLeave).not.toHaveBeenCalled();
});

it("will call on unmount", () => {
  const { unmount } = useTestHook(() => useEffect(spy), { mountEager: true });
  expect(spy).toBeCalledTimes(1);
  expect(spyLeave).not.toHaveBeenCalled();

  unmount();
  expect(spy).toBeCalledTimes(1);
  expect(spyLeave).toHaveBeenCalled();
});

it("will enter, leave and enter on unmount, mount", () => {
  const { unmount, mount } = useTestHook(() => useEffect(spy), {
    mountEager: true
  });
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
  const { flushEffects } = useTestHook(() => useEffect(spy), {
    mountEager: true
  });
  expect(spy).toBeCalledTimes(1);
  expect(spyLeave).not.toHaveBeenCalled();

  flushEffects();
  expect(spy).toBeCalledTimes(2);
  expect(spyLeave).toHaveBeenCalledTimes(1);
});
