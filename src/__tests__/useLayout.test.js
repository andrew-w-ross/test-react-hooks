var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useTestHook } from "../useTestHook";
import { useLayoutEffect } from "react";
const spyLeave = jest.fn();
const spy = jest.fn(() => spyLeave);
afterEach(() => {
    jest.clearAllMocks();
});
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
it("will enter, leave and enter on update", () => __awaiter(this, void 0, void 0, function* () {
    const { flushEffects } = useTestHook(() => useLayoutEffect(spy));
    expect(spy).toBeCalledTimes(1);
    expect(spyLeave).not.toHaveBeenCalled();
    flushEffects();
    expect(spy).toBeCalledTimes(2);
    expect(spyLeave).toHaveBeenCalledTimes(1);
}));
