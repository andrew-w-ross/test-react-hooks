import { useTestHook, cleanUp } from "test-react-hooks";
import { useState } from "react";

//Cleans up the dom container that's created during testing
afterEach(() => cleanUp());

// Create your hook
const counterHook = (inc = 1) => {
  const [count, setCount] = useState(0);
  const incFn = () => setCount(count + inc);
  return [count, incFn];
};

it("will count", () => {
  //Setup your hook
  const { getResult } = useTestHook(() => counterHook());
  //And get the current result
  let [count] = getResult();
  expect(count).toBe(0);

  //This is the result after the change
  [count] = getResult(
    //changes can need to be passed run here
    ([, incFn]) => incFn()
  );
  expect(count).toBe(1);
});
