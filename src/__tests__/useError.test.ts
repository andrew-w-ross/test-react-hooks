import { useEffect } from "react";
import { createTestProxy } from "../createTestProxy";

type ThrowWhen = "render" | "aftermount" | "unmount";

function useError(when: ThrowWhen, deps: any[] = []) {
  if (when === "render") throw new Error(when);
  useEffect(() => {
    if (when === "aftermount") throw new Error(when);
    return () => {
      throw new Error(when);
    };
  }, deps);
}

const [prxError, control] = createTestProxy(useError);
it("will throw straight away", () => {
  expect(() => prxError("render")).toThrowError("render");
});

it("will throw after mount", () => {
  expect(() => prxError("aftermount")).toThrowError("aftermount");
});

it("will throw on unmount", () => {
  prxError("unmount");
  expect(() => control.unmount()).toThrowError("unmount");
});

it("will throw on deps change", () => {
  prxError("unmount", [1]);
  expect(() => prxError("unmount", [2])).toThrowError("unmount");
});
