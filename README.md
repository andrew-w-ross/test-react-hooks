# test-react-hooks

Simple testing for react hooks

## Get Started

To install either :

`yarn install test-react-hooks -D` or `npm i test-react-hooks --save-dev`

`test-react-hooks` needs a dom to work, if you're running jest you should be good to go. For anything else consult your testing framework of choice.

```javascript
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

  //Then get the new results
  [count] = getResult(([, incFn]) => incFn());
  expect(count).toBe(1);
});
```

## TODO

- Add more examples
