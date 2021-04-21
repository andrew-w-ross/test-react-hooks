# test-react-hooks ⚓️

Easiest to testing library for react hooks out there.

[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
![](https://img.shields.io/david/andrew-w-ross/test-react-hooks.svg?style=flat)
![](https://img.shields.io/npm/dt/test-react-hooks.svg?style=flat)
![](https://img.shields.io/npm/v/test-react-hooks.svg?style=flat)
![](https://github.com/andrew-w-ross/test-react-hooks/workflows/CI/badge.svg)

## Contents

- [test-react-hooks ⚓️](#test-react-hooks-️)
  - [Contents](#contents)
  - [Get Started](#get-started)
  - [Usage](#usage)
  - [Examples](#examples)
  - [Api](#api)
    - [createTestProxy](#createtestproxy)
      - [Arguments](#arguments)
      - [Result](#result)
    - [UpdateWaiter](#updatewaiter)
    - [cleanup](#cleanup)
    - [act](#act)

## Get Started

To install add `test-react-hooks` and it's peer dependencies `react` and `react-test-renderer`.

Depending on your package manager run one of the following commands.

-   `yarn add test-react-hooks react react-test-renderer -D`
-   `npm i test-react-hooks react react-test-renderer --save-dev`

## Usage

```javascript
import { createTestProxy } from "test-react-hooks";
import { useState } from "react";

// Create your hook
const useCounter = (initial = 0, inc = 1) => {
    const [count, setCount] = useState(initial);
    const inc = () => setCount(count + inc);
    return {
        count,
        inc,
    };
};

//Proxy of your hook, use it like you would in a component
//Internally calls render for the hook and act on everything else
const [prxCounter] = createTestProxy(useCounter);

it("will increment by one", () => {
    {
        const { count, inc } = prxCounter();
        expect(count).toBe(0);
        inc();
    }

    {
        const { count } = prxCounter();
        expect(count).toBe(1);
    }
});

it("start with a new initial amount", () => {
    {
        const { count, inc } = prxCounter(4);
        expect(count).toBe(4);
        inc();
    }

    {
        const { count } = prxCounter(4);
        expect(count).toBe(5);
    }
});

it("will increment by a new amount", () => {
    {
        const { count, inc } = prxCounter(0, 2);
        expect(count).toBe(0);
        inc();
    }

    {
        const { count } = prxCounter(0, 2);
        expect(count).toBe(2);
    }
});
```

## Examples

Example usage can be found at this [in the examples directory on the repo.](https://github.com/andrew-w-ross/test-react-hooks/tree/master/examples)

Or click on the below link to a sandbox with the above examples.

[![Edit examples](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/andrew-w-ross/test-react-hooks/tree/master/examples?autoresize=1&module=%2Fcount.spec.js&previewwindow=tests)

## Api

### createTestProxy

`createTestProxy<THook, TProps = any>(hook: THook,options: UseProxyOptions<TProps> = {}) => [THook, HookControl<TProps>]`

Creates a proxy of the hook passed in for testing.

#### Arguments

-   `hook` : hook to be tested

-   `options` : optional options to render the hook with

```typescript
/**
 * Options for @see createTestProxy
 */
export type CreateTestProxyOptions = {
    /**
     * Options that are forwared to @see {@link https://reactjs.org/docs/test-renderer.html react-test-renderer }
     */
    testRendererOptions?: TestRendererOptions;

    /**
     * Wrapper component for the hook callback, make sure children is rendered
     */
    wrapper?: WrapperComponent;
};
```

#### Result

Tuple with the first element being a proxy hook and it's control object

`[THook, TestProxyControl]`

-   `THook` - A proxy of the hook argument, each call to the hook will call render

-   `TestProxyControl` - Control object for the proxy hook

```typescript
type TestProxyControl = {
    /**
     * Sets the wrapper, passing in null or undefined will use the default wrapper.
     * Setting this does not force a render.
     */
    wrapper: WrapperComponent | null | undefined;

    /**
     * Unmount the current component.
     */
    unmount: () => void;

    /**
     * Creates an @see UpdateWaiter that by default will wait for the component to stop updating for `2ms`.
     * @returns UpdateWaiter
     */
    waitForNextUpdate: () => UpdateWaiter;
};
```

### UpdateWaiter

```typescript
/**
 * UpdateWaiter is a fluent api that will resolve when it's conditions are met.
 */
class UpdateWaiter extends Promise {
    /**
     * @param waitFn function that takes in an {Observable<UpdateEvent>} and returns an {Observable<any>} or a {Promise}
     */
    addWaiter(
        waitFn: (
            updateObserver: Observable<UpdateEvent>,
        ) => SubscribableOrPromise<any>,
    ): this;

    /**
     * Waits for the updates to stop for a certain amount of time before resolving.
     * @param ms - Time to wait in ms
     */
    debounce(ms = 2): this;

    /**
     * Waits for a certain amount of updates before resolving.
     * @param count - Amount of update to wait for.
     */
    updateCount(count = 1): this;

    /**
     * If there is more than one condition how should they be handled
     * @param mode - is either the string 'race' or 'all' if 'race' will wait for one to resolve if 'all' waits for all to resolve.
     */
    iterationMode(mode: WaitMode): this;
}
```

### cleanup

`cleanUp():void`

Function to be called after your tests to clean up the test renderer created during testing.
By default will look on the global scope if an `afterEach` is defined and a function and attempt to hook up any cleanup function to that. To disable this behavior set `TEST_REACT_HOOKS_NO_CLEANUP` enviroment variable.

### act

`act(callback: () => void):void`

Re-exported from [react-test-renderer](https://reactjs.org/docs/test-renderer.html#testrendereract)

Use this if your updating the dom outside the hook.

For an example on correct usage check out [dom event example](./examples/domevent.test.js)
