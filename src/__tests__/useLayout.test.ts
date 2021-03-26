import { createTestProxy } from "../createTestProxy";
import { useLayoutEffect } from "react";

const spyLeave = jest.fn();
const spy = jest.fn(() => spyLeave);

const [prxLayoutEffect, control] = createTestProxy(useLayoutEffect);

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
