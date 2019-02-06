import { useTestHook } from "../useTestHook";
import { useState, useEffect } from "react";
const leaveSpy = jest.fn();
const spy = jest.fn(() => leaveSpy);
const customHook = () => {
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
    let [count, setCount] = getResult();
    expect(count).toBe(2);
    setCount(3);
    [count, setCount] = getResult();
    expect(count).toBe(3);
});
it("will not remove state on flushEffects", () => {
    const { getResult, flushEffects } = useTestHook(customHook);
    let [count, setCount] = getResult();
    expect(count).toBe(0);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(leaveSpy).not.toHaveBeenCalled();
    setCount(1);
    [count, setCount] = getResult();
    expect(count).toBe(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(leaveSpy).not.toHaveBeenCalled();
    flushEffects();
    [count, setCount] = getResult();
    expect(count).toBe(1);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(leaveSpy).toHaveBeenCalledTimes(2);
});
it("will flush all state changes", () => {
    const { getResult } = useTestHook(customHook);
    let [count, setCount] = getResult();
    expect(count).toBe(0);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(leaveSpy).not.toHaveBeenCalled();
    setCount(1);
    expect(leaveSpy).not.toHaveBeenCalled();
    setCount(2);
    setCount(3);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(leaveSpy).toHaveBeenCalledTimes(2);
});
