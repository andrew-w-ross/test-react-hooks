import { useDebugValue } from "react";
import { useTestProxy } from "../useTestProxy";

const [prxDebugValue] = useTestProxy(useDebugValue);

it("won't break", () => {
  prxDebugValue("value");
});

it("won't break with format", () => {
  const spy = jest.fn();
  prxDebugValue("value", spy);
});
