import { useRef } from "react";
import { useTestProxy } from "../useTestProxy";

const [prxRef] = useTestProxy(useRef);

it("will set initiat with value", () => {
  const ref = prxRef(1);
  expect(ref.current).toBe(1);
});

it("will keep the value on rerender", () => {
  {
    const ref = prxRef(1);
    expect(ref.current).toBe(1);
    ref.current = 3;
  }
  {
    const ref = prxRef(1);
    expect(ref.current).toBe(3);
  }
});
