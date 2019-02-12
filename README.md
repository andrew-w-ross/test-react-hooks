# test-react-hooks ⚓️

Simple testing for react hooks

![](https://img.shields.io/david/andrew-w-ross/test-react-hooks.svg?style=flat) ![](https://img.shields.io/npm/dt/test-react-hooks.svg?style=flat) ![](https://img.shields.io/npm/v/test-react-hooks.svg?style=flat)

## Get Started

To install either :

`yarn install test-react-hooks -D` or `npm i test-react-hooks --save-dev`

`test-react-hooks` needs a dom to work, if you're running jest you should be good to go. For anything else consult your testing framework of choice.

Simple example with useState

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
  {
    let [count] = getResult();
    expect(count).toBe(0);
  }

  {
    //This is the result after the change
    const [count] = getResult(
      //changes can need to be passed run here
      ([, incFn]) => incFn()
    );
    expect(count).toBe(1);
  }
});
```

## Api

test-react-hooks exports two functions.

`cleanUp():void`

Function to be called after your tests to clean up the container created during tests.

`useTestHook<TRes, TConVal = unknown>( setupFn: () => TRes, options: TestHookOptions<TConVal> = {}): HookState<TRes, TConVal>`

- `setupFn` : setup function for your hook, should return the hook output for testing.

- `HookState` : Result of `useTestHook` with the following object

```typescript
export type HookState<TRes, TConVal> = {
  /**
   * Gets the current result of the hook
   */
  getResult: (updateFn?: UpdateFn<TRes>) => TRes;
  /**
   * Unmounts the component the hook is in
   */
  unmount: () => boolean;
  /**
   * Mounts the test component the hook is in
   */
  mount: () => void;
  /**
   * Forces a useEffect to unsubscribe and fire again
   */
  flushEffects: () => void;
  /**
   * Sets the value of the context
   */
  setContextVal: (value: TConVal) => void;

  /**
   * Element that the test component is mounted on, use with caution
   *
   * @type {HTMLElement}
   */
  container: HTMLElement;
};
```

- `options` :

```typescript
export type TestHookOptions<TConVal> = {
  /**
   * Optional context to render the hook in
   * @type {Context<TConVal>}
   */
  context?: Context<TConVal>;
  /**
   * Initial context value for the provided context
   * @type {TConVal}
   */
  contextVal?: TConVal;

  /**
   * Should it mount straight away or when needed?
   * @type {boolean}
   */
  mountEager?: boolean;
};
```
