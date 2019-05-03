import { useTestHook, useTestProxy } from "../";
import { useLayoutEffect, useEffect } from "react";

const spyLeave = jest.fn();
const spy = jest.fn(() => spyLeave);

describe("useTestHook", () => {
  it("will fires enter on mount", () => {
    useTestHook(() => useLayoutEffect(spy), { mountEager: true });

    expect(spy).toBeCalledTimes(1);
    expect(spyLeave).not.toHaveBeenCalled();
  });

  it("will fire on leave on unmount", () => {
    const { unmount } = useTestHook(() => useLayoutEffect(spy), {
      mountEager: true
    });
    expect(spy).toBeCalledTimes(1);
    expect(spyLeave).not.toHaveBeenCalled();

    unmount();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyLeave).toHaveBeenCalledTimes(1);
  });

  it("will enter, leave and enter on unmount, remount", () => {
    const { unmount, mount } = useTestHook(() => useLayoutEffect(spy), {
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
    const { flushEffects } = useTestHook(() => useLayoutEffect(spy), {
      mountEager: true
    });
    expect(spy).toBeCalledTimes(1);
    expect(spyLeave).not.toHaveBeenCalled();

    flushEffects();
    expect(spy).toBeCalledTimes(2);
    expect(spyLeave).toHaveBeenCalledTimes(1);
  });
});

describe("useTestProxy", () => {
  const [prxLayoutEffect, control] = useTestProxy(useLayoutEffect);

  it("will call on mount", () => {
    prxLayoutEffect(spy, []);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyLeave).not.toHaveBeenCalled();

    control.unmount();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyLeave).toHaveBeenCalledTimes(1);
  });

  it("will call on unmount", () => {
    prxLayoutEffect(spy);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyLeave).not.toHaveBeenCalled();
  });

  it("will call on arg change", () => {
    prxLayoutEffect(spy, [1]);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyLeave).not.toHaveBeenCalled();

    prxLayoutEffect(spy, [2]);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spyLeave).toHaveBeenCalledTimes(1);
  });
});
