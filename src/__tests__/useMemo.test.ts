import { useMemo } from "react";
import { useTestProxy } from "../useTestProxy";

const [prxMemo] = useTestProxy(useMemo);
const spy = jest.fn(() => 1);

it("will return a result", () => {
  const res = prxMemo(spy, []);
  expect(res).toBe(1);
});

it("will not update if args stay the same", () => {
  prxMemo(spy, [1]);
  expect(spy).toBeCalledTimes(1);

  prxMemo(spy, [1]);
  expect(spy).toBeCalledTimes(1);
});

it("will update on arg change", () => {
  prxMemo(spy, [1]);
  expect(spy).toBeCalledTimes(1);

  prxMemo(spy, [2]);
  expect(spy).toBeCalledTimes(2);
});
