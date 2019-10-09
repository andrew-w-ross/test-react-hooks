import { useDebugValue } from "react";
import { createTestProxy } from "../createTestProxy";

const [prxDebugValue] = createTestProxy(useDebugValue);

it("won't break", () => {
  prxDebugValue("value");
});

it("won't break with format", () => {
  const spy = jest.fn();
  prxDebugValue("value", spy);
});
