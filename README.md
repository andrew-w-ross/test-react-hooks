# test-react-hooks ⚓️

Simplest testing library for react hooks.

[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
![](https://img.shields.io/david/andrew-w-ross/test-react-hooks.svg?style=flat)
![](https://img.shields.io/npm/dt/test-react-hooks.svg?style=flat)
![](https://img.shields.io/npm/v/test-react-hooks.svg?style=flat)
![](https://github.com/andrew-w-ross/test-react-hooks/workflows/CI/badge.svg)

## Contents

-   [test-react-hooks ⚓️](#test-react-hooks-️)
    -   [Contents](#contents)
    -   [Get Started](#get-started)
    -   [Usage](#usage)
    -   [Examples](#examples)
    -   [Api](#api)
        -   [createTestProxy](#createtestproxy)
            -   [Arguments](#arguments)
            -   [Result](#result)
        -   [UpdateWaiter](#updatewaiter)
        -   [cleanup](#cleanup)
        -   [act](#act)

## Get Started

To install add `test-react-hooks` and it's peer dependencies `react` and `react-test-renderer`.

Depending on your package manager run one of the following commands.

-   `yarn add test-react-hooks react react-test-renderer -D`
-   `npm i test-react-hooks react react-test-renderer --save-dev`

## Quick Start

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

## Api Documentation

Main entry point of the project is [the createTestProxy function.](docs/api/readme.md#createtestproxy)

For the rest of the api documentation [click here.](docs/api/readme.md)

## Why use test-react-hooks?

Testing by it's very nature in in inherently filled with uncertainty.
The goal of `test-react-hooks` is to remove that uncertainty by giving an api that feels like just using the hook with as little api between you and it.

It also not silent about when things go wrong, a goal for this library is to break where an error occurs.
Error handling will be covered in more detail below.

Overall it attempts to get out of your way without any surprises on how to write your tests or how they'll behave when used in react.

## Slower start

The main entry point for `test-react-hooks` is [createTestProxy](docs/api/readme.md#createtestprox).
It takes in two arguments the first is the hook that you'll want to test and the second is an optional [options argument](docs/api/readme.md#createtestproxyoptions).

```javascript
import { useState } from "react";
import { createTestProxy } from "test-react-hooks";

const [prxState, control] = createTestProxy(useState);
// or createTestProxy(useHook, optionsObject);
```

`createTestProxy` returns a tuple with two elements the first is a proxied version of your hook and the second is a control object.
As a naming convention `use` is replaced with `prx`.

### A note on naming

> As a style choice replacing `use` with `prx` gives a hint at a relation to the original hook, stops the warning from eslint and avoids a symbol clash.
> With that being said the name has no technical requirement so naming it what you wish is fine.

Calling the proxied hook will force a render or update the underlying component and return the hook results.
Given the above example here is how you'd test a state update.

```javascript
it("will update state", () => {
    //Code blocks are useful to avoid symbol clashing
    {
        //This is just the useState hook, use it the same way you would useState
        const [value, setValue] = prxState(1);
        expect(value).toBe(1);
        setValue(2);
        //FYI `value` is still 1 here, same behavior as react
    }

    {
        //Next render of the hook
        const [value, setValue] = prxState(1);
        expect(value).toBe(2);
    }
});
```

As you can see the usage of the proxied version of `useState` is the same as you would do in react.
This would suggest that a call to the proxied hook is stateful and it is.

## Cleanup

`test-react-hooks` exports a `cleanUp` function that needs to be called between tests.
Proxied hooks can safely be shared across multiple tests as long as the `cleanUp` function is called between tests.

`test-react-hooks` will look for an `afterEach` function on the global scope when imported and register the cleanup function.
In most cases this will be done for you and if it's not a warning explaining that `cleanUp` needs to be called will be printed.
If for some reason you want to disable this behavior define a variable on the environment `TEST_REACT_HOOKS_NO_CLEANUP`.

## Control Object

The second element returned by `createTestProxy` in a control object.
The control, as the name suggest, allows external control to the proxy hook.
Why it exists will be made evident below.

## Async Tests

When writing an async test the issue is to wait for something to happen.
This external control object exposes a method `waitForNextUpdate` that by default returns a promise that resolves when the component to stops updating for `3ms`.
This should cover most uses cases but if you'll need more control of the wait behavior read on to the advanced async section.

```javascript
//Takes a function in as a dependency, calls it and then sets the value when it resolves.
//Note don't actually use this hook, it does no error handling and doesn't check it mounted
function useAsync(fn) {
    const [value, setValue] = useState(null);
    useEffect(() => {
        fn().then(setValue);
    }, [fn]);

    return value;
}

const [prxAsync, control] = createTestProxy(useAsync);

it("will wait for the value to update", async () => {
    const fn = () => Promise.resolve(1);

    {
        const result = prxAsync(fn);
        expect(result).toBe(null);
    }

    //Wait for the component to finish updating.
    await control.waitForNextUpdate();

    {
        const result = prxAsync(fn);
        expect(result).toBe(1);
    }
});
```

## Wrapper Component

In some cases you'll need to render the hook as child of another component, normally when using context.

There are two options here, it can be passed in as an option when calling `createTestProxy` or updated by setting the `wrapper` property on the control object.

```javascript
const themes = {
    light: {
        foreground: "#000000",
        background: "#eeeeee",
    },
    dark: {
        foreground: "#ffffff",
        background: "#222222",
    },
};

//Note that there is no default value so it'll return undefined
const ThemeContext = React.createContext();

const [prxContext, control] = createTestProxy(useContext, {
    //Wrapper has to render it's children or the hook won't work
    //If in strict mode it'll throw an error on call, if not it'll print a warning
    wrapper: ({ children }) => (
        <ThemeContext.Provider value={themes.light}>
            {children}
        </ThemeContext.Provider>
    ),
});

it("will get the value from the wrapper in config", () => {
    const result = prxContext(ThemeContext);
    expect(result).toEqual(themes.light);
});

it("will update the wrapper in the control object", () => {
    {
        const result = prxContext(ThemeContext);
        expect(result).toEqual(themes.light);
    }

    //Doesn't force a render next call to hook to render
    control.wrapper = ({ children }) => (
        <ThemeContext.Provider value={themes.dark}>
            {children}
        </ThemeContext.Provider>
    );

    {
        const result = prxContext(ThemeContext);
        expect(result).toEqual(themes.dark);
    }
});
```

## Unmount

Control object also exposes an `unmount` function, that as the name suggests unmounts the component.

```javascript
//Calls the function passed in on unmount
function useOnUnmount(cb) {
    useEffect(() => {
        return () => {
            cb();
        };
    }, [cb]);
}

const [prxOnUnmount, control] = createTestProxy(useOnUnmount);

it("will call the callback on unmount", () => {
    const unmountSpy = jest.fn();

    prxOnUnmount(unmountSpy);
    expect(unmountSpy).not.toHaveBeenCalled();

    control.unmount();
    expect(unmountSpy).toHaveBeenCalled();
});
```

## Errors

This is `test-react-hooks` party trick.
Unlike other react hook testing libraries `test-react-hooks` will hoist errors to the caller.
It's hugely important that tests don't surprise with hidden exceptions.

Let's have a look at all the situations this could happen.

```javascript
function useError(when) {
    if (when === "render") throw new Error(when);
    useEffect(() => {
        if (when === "aftermount") throw new Error(when);
        return () => {
            if (when === "unmount") {
                throw new Error(when);
            }
        };
    }, [when]);
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
    //Even on unmount it'll capture
    expect(() => control.unmount()).toThrowError();
});
```
