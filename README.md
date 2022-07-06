# test-react-hooks ⚓️

Simplest testing library for react hooks.

[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
![](https://img.shields.io/npm/dt/test-react-hooks.svg?style=flat)
![](https://img.shields.io/npm/v/test-react-hooks.svg?style=flat)
![](https://github.com/andrew-w-ross/test-react-hooks/workflows/CI/badge.svg)

## Contents

-   [test-react-hooks ⚓️](#test-react-hooks-️)
    -   [Contents](#contents)
    -   [Installing](#installing)
-   [Quick Start](#quick-start)
    -   [Examples](#examples)
    -   [Api Documentation](#api-documentation)
    -   [Why use test-react-hooks?](#why-use-test-react-hooks)
-   [Slower start](#slower-start)
    -   [A note on naming](#a-note-on-naming)
    -   [Cleanup](#cleanup)
-   [Control Object](#control-object)
    -   [Async](#async)
    -   [Wrapper Component](#wrapper-component)
    -   [Unmount](#unmount)
-   [Advanced](#advanced)
    -   [Suspense](#suspense)
        -   [Suspense Caveat](#suspense-caveat)
    -   [Errors](#errors)
        -   [Errors Caveat](#errors-caveat)
    -   [Advanced Async](#advanced-async)
        -   [Debounce](#debounce)
        -   [Update Count](#update-count)
        -   [Custom Waiters](#custom-waiters)
        -   [Using Fake Timers](#using-fake-timers)
-   [Technical Bits](#technical-bits)
    -   [What happened to the `act` calls?](#what-happened-to-the-act-calls)

## Installing

To install add `test-react-hooks` and it's peer dependencies `react` and `react-test-renderer`.

Depending on your package manager run one of the following commands.

-   `yarn add test-react-hooks react react-test-renderer -D`
-   `npm i test-react-hooks react react-test-renderer --save-dev`

# Quick Start

The entry point for `test-react-hooks` is `createTestProxy` method that returns a tuple with two elements.
The first element is the proxied hook and the second is a control object but let's ignore that for now.

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

//Proxy of your hook, use it like you would in a component.
//Internally ensures your hook is rendered inside of a component with react-test-renderer
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

Main entry point of the project is [the createTestProxy function.](docs/api/README.md#createtestproxy)

For the rest of the api documentation [click here.](docs/api/README.md)

## Why use test-react-hooks?

Testing by it's very nature in in inherently filled with uncertainty.
The goal of `test-react-hooks` is to remove that uncertainty by giving an api that feels like just using the hook with as little api between you and it.

It also not silent about when things go wrong, a goal for this library is to break where an error occurs.
Error handling will be covered in more detail below.

Overall it attempts to get out of your way without any surprises on how to write your tests or how they'll behave when used in react.

# Slower start

The main entry point for `test-react-hooks` is [createTestProxy](docs/api/README.md#createtestprox).
It takes in two arguments the first is the hook that you'll want to test and the second is an optional [options argument](docs/api/README.md#createtestproxyoptions).

```javascript
import { useState } from "react";
import { createTestProxy } from "test-react-hooks";

const [prxState, control] = createTestProxy(useState);
// or createTestProxy(useHook, optionsObject);
```

`createTestProxy` returns a tuple with two elements the first is a proxied version of your hook and the second is a control object.
As a naming convention `use` is replaced with `prx`.

## A note on naming

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
Proxied hooks can safely be shared across multiple tests as long as the `cleanUp` function is called between tests resetting it's state.

`test-react-hooks` will look for an `afterEach` function on the global scope when imported and register the cleanup function.
In most cases this will be done for you and if it's not a warning explaining that `cleanUp` needs to be called will be printed.
If for some reason you want to disable this behavior define a variable on the environment `TEST_REACT_HOOKS_NO_CLEANUP` but be warned you'll probably break all your tests.

# Control Object

The second element returned by `createTestProxy` in a control object.
The control, as the name suggest, allows external control to the proxy hook.

## Async

When writing an async test the issue is to wait for the next update.
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

//Note that if the wrapper is passed in as a parameter on the config object on reset on cleanup
it("will get the value from the wrapper in config", () => {
    const result = prxContext(ThemeContext);
    expect(result).toEqual(themes.light);
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

# Advanced

Everything below is quite technical and probably not necessary to understand for basic testing.
If you've not written any tests yet go away install `test-react-hooks` and write some tests.

## Suspense

[Here is the documentation for it](https://reactjs.org/docs/concurrent-mode-suspense.html) but a
a quick intro on how suspense works it's a promise thrown during render.
React will use the promise to determine when to stop suspending.

Suspense is tested in the essentially the same way that async hooks are but with a caveat.

```javascript
//Records the execution state of the function, the function used as the key.
const RESULT_CACHE = new Map();

export function useAsyncSuspense<TResult>(fn: () => Promise<TResult>): TResult {
    if (!RESULT_CACHE.has(fn)) {
        const execution = fn()
            .then((result) => {
                RESULT_CACHE.set(fn, { type: "completed", result });
            })
            .catch((error) => {
                RESULT_CACHE.set(fn, { type: "error", error });
            });
        RESULT_CACHE.set(fn, { type: "running", execution });
    }

    return useMemo(() => {
        const state = RESULT_CACHE.get(fn)!;

        switch (state.type) {
            case "running":
                throw state.execution;
            case "error":
                throw state.error;
            default:
                return state.result;
        }
    }, [fn]);
}

afterEach(() => {
    RESULT_CACHE.clear();
});

const [prxAsyncSuspense, control] = createTestProxy(useAsyncSuspense);

it("will wait for suspense", async () => {
    const getStuff = () => Promise.resolve(1);
    {
        //Suspends here which might be a bit surprising
        prxAsyncSuspense(getStuff));
    }

    //Wait for the hook to complete updating
    await control.waitForNextUpdate();

    {
        const result = prxAsyncSuspense(getStuff);
        expect(result).toBe(1);
    }
});
```

### Suspense Caveat

What's the caveat then? Take a closer look at the first call to the proxy.

```javascript
//Didn't this function throw on first call to suspend itself? What does this return then?
prxAsyncSuspense(getStuff));
```

To signify that the hook is now in a suspended state `test-react-hooks` exports a symbol `SUSPENDED`.
If you absolutely need to check that the hook is in a suspended state you can check against the `SUSPENDED` symbol.

```javascript
import { SUSPENDED } from "test-react-hooks";

//Using the code mentioned above

it("will return suspense", async () => {
    const getStuff = () => Promise.resolve(1);
    {
        const result = prxAsyncSuspense(getStuff);
        expect(result).toBe(SUSPENDED);
    }

    await control.waitForNextUpdate();

    {
        const result = prxAsyncSuspense(getStuff);
        expect(result).toEqual(1);
    }
});
```

## Errors

This is `test-react-hooks` party trick.
Unlike other react hook testing libraries `test-react-hooks` will hoist errors to the caller.
It's hugely important that tests don't surprise with hidden exceptions, instead throwing to the call.

Let's have a look at all the situations this could happen.

```javascript
//When argument determines where in the lifecycle to the error should throw
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
    //Error directly on render
    expect(() => prxError("render")).toThrowError("render");
});

it("will throw after mount", () => {
    //Error just after mount
    expect(() => prxError("aftermount")).toThrowError("aftermount");
});

it("will throw on unmount", () => {
    prxError("unmount");
    //Even on unmount it'll hoist any errors caught
    expect(() => control.unmount()).toThrowError();
});
```

It'll also hoist errors from returned functions.

```javascript
function useMemberError() {
    function fnThrow() {
        throw new Error("boom");
    }
    return {
        fnThrow,
        deep: {
            nested: {
                fnThrow,
            },
        },
    };
}

const [prxMemberError] = createTestProxy(useMemberError);

it("will throw on member call", () => {
    const { fnThrow } = prxMemberError();
    expect(fnThrow).toThrowError("boom");
});

it("will throw on deep member call", () => {
    const result = prxMemberError();
    expect(result.deep.nested.fnThrow).toThrowError("boom");
});
```

It'll even hoist from a reducer calls.

```javascript
const initialState = { count: 0 };

function reducer(state, action) {
    switch (action.type) {
        case "increment":
            return { count: state.count + 1 };
        case "decrement":
            return { count: state.count - 1 };
        case "throw":
            throw new Error("Boom");
        default:
            return state;
    }
}

const [prxReducer] = createTestProxy(useReducer);

it("will handle multiple dispatches", () => {
    const [, dispatch] = prxReducer(reducer, initialState);
    dispatch({ type: "increment" });
    dispatch({ type: "increment" });
    dispatch({ type: "increment" });
    dispatch({ type: "decrement" });

    const [state] = prxReducer(reducer, initialState);
    expect(state.count).toBe(2);
});

it("will catch the error", () => {
    const [, dispatch] = prxReducer(reducer, initialState);

    expect(() => dispatch({ type: "throw" })).toThrowError("Boom");
});
```

Recall the [suspense example](#Suspense) above.
If the suspended promise ultimately rejects then `waitForNextUpdate` will reject.

```javascript
it("will throw on waitForNextUpdate if suspense rejects", async () => {
    const throwStuff = () => Promise.reject(new Error("Boom Suspense"));
    prxAsyncSuspense(throwStuff));

    //Rejects if the suspended promise rejects
    await expect(control.waitForNextUpdate()).rejects.toThrowError(
        "Boom Suspense",
    );
});
```

### Errors Caveat

Recall the [async example](#async) above, what happens if the promise rejects?

```javascript
it("will not work on unhandled promise rejections", async () => {
    const throwFn = () => Promise.reject(new Error("Boom Async"));

    {
        const result = prxAsync(throwFn);
        expect(result).toBe(null);
    }

    //It should reject right?
    await expect(control.waitForNextUpdate()).rejects.toThrowError(
        "Boom Async",
    );
});
```

In jest you'll get the following error:

```bash
 ● will not work on unhandled promise rejections

    Boom Async

      31 |
      32 | it("will not work on unhandled promise rejections", async () => {
    > 33 |     const throwFn = () => Promise.reject(new Error("Boom Async"));
         |                                          ^
      34 |
      35 |     {
      36 |         const result = prxAsync(throwFn);

```

You're testing framework might differ but overall the behavior should generally be the same.
Why does this not reject on `waitForNextUpdate`?

The promise in this case is hidden to both `react` and `test-react-hooks`.
The only way of determining an unhandled rejection occurred is to listen for `process.on('unhandledRejection')`.
You're testing framework would probably already register a listener and would fail the test already at this point.
It's just too invasive for a testing library to mess around with the testing environment itself.

## Advanced Async

`waitForNextUpdate` doesn't just return a `Promise` it returns an instance of [UpdateWaiter](docs/api/classes/updatewaiter.md) that extends a `Promise`.
Update waiter is a fluent api that can wait for specific changes before resolving.

```javascript
function useBatchAsync(ms = 1) {
    const [value, setValue] = useState(0);
    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        for (let i = 1; i <= 3; i++) {
            setTimeout(() => {
                //Don't set if not mounted
                if (mounted.current) {
                    setValue((i) => i + 1);
                }
            }, i * ms);
        }
        return () => {
            mounted.current = false;
        };
    }, [ms]);

    return value;
}

const [prxBatchAsync, control] = createTestProxy(useBatchAsync);
```

### Debounce

The default waiting method is to [debounce](docs/api/classes/updatewaiter.md#debounce) for `3ms` in other words it'll wait for updates to stop for `3ms` before resolving. Note it'll still wait for the first update before resolving.

```javascript
it("will run batch async operations", async () => {
    {
        const result = prxBatchAsync();
        //Initial value
        expect(result).toEqual(0);
    }

    await control.waitForNextUpdate();

    {
        const result = prxBatchAsync();
        expect(result).toEqual(3);
    }
});
```

If you wanted to wait for longer just call the debounce function on the fluent api.

```javascript
it("will run batch async operations with a longer debounce", async () => {
    {
        const result = prxBatchAsync(5);
        //Initial value
        expect(result).toEqual(0);
    }

    //Will now wait for 6ms before resolving
    await control.waitForNextUpdate().debounce(6);

    {
        const result = prxBatchAsync(5);
        expect(result).toEqual(3);
    }
});
```

### Update Count

If you want to wait for a specific amount of updates before resolving there's an [updateCount](docs/api/classes/updatewaiter.md#updateCount) method.
It takes an optional argument to wait for set amount of updates to occur before resolving.

> Update count can make your tests somewhat brittle so use with caution.

```javascript
it("will wait for each update", async () => {
    {
        const value = prxBatchAsync();
        expect(value).toEqual(0);
    }

    await control.waitForNextUpdate().updateCount(1);

    {
        const value = prxBatchAsync();
        expect(value).toEqual(1);
    }

    await control.waitForNextUpdate().updateCount(2);

    {
        const value = prxBatchAsync();
        expect(value).toEqual(3);
    }
});
```

### Custom Waiters

It's also possible to write a custom waiter with the [addWaiter](docs/api/classes/updatewaiter.md#addWaiter) function.

```javascript
const wait = (ms = 10 = new Promise((resolve) => setTimeout(resolve, ms)));

it("will use the custom waiter function", async () => {
    {
        const value = prxBatchAsync();
        expect(value).toEqual(0);
    }

    //Unlike debounce just waits for a straight 10ms and resolves, won't wait for the first update event
    await control.waitForNextUpdate().addWaiter(() => wait());

    {
        const value = prxBatchAsync();
        expect(value).toEqual(3);
    }
});
```

Custom waiter is passed in a [rxjs Observable](https://rxjs.dev/guide/observable) with an [UpdateEvents](docs/api/README.md#updateevent).
If you're familiar with `rxjs` `addWaiter` can take anything that `rxjs` considers to be [ObservableInput](https://rxjs.dev/api/index/type-alias/ObservableInput).
For the most part a returning a `Promise` is probably what you want as internally it'll wait for the first event from a waiting function.

### Using Fake Timers

`test-react-hooks` is tested using `jest` so documented code might differ for your framework of choice.

```javascript
const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

function useWaits() {
    const [value, setValue] = useState(0);

    wait(1).then(() => setValue(1));
    wait(10).then(() => setValue(10));
    wait(100).then(() => setValue(100));

    return value;
}

beforeEach(() => {
    jest.useFakeTimers("modern");
});

afterEach(() => {
    jest.useRealTimers();
});

const [prxWaits, control] = createTestProxy(useWaits);

it("can use proxy timer in waiter fn", async () => {
    {
        const value = prxWaits();
        expect(value).toBe(0);
    }

    await control
        .waitForNextUpdate()
        //Don't forget to add async to turn this into a promise
        .addWaiter(async () => jest.advanceTimersByTime(2));

    {
        const value = prxWaits();
        expect(value).toBe(1);
    }

    await control
        .waitForNextUpdate()
        .addWaiter(async () => jest.advanceTimersByTime(10));

    {
        const value = prxWaits();
        expect(value).toBe(10);
    }

    await control
        .waitForNextUpdate()
        .addWaiter(async () => jest.advanceTimersByTime(90));

    {
        const value = prxWaits();
        expect(value).toBe(100);
    }
});
```

# Technical Bits

## What happened to the `act` calls?

If you're familiar with [react-test-renderer](https://reactjs.org/docs/test-renderer.html#testrendereract) you'll note that updates need to be wrapped in `act`.
Where are the calls to `act` in `test-react-hooks`?

It's where the `proxy` part of `createTestProxy` comes in.
The hook passed in and any results returned will be proxied using [Standard library Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).
`act` is then called for any proxied function calls. Using the counter example used in the quick start but with annotations.

```javascript
import { createTestProxy } from "test-react-hooks";
import { useState } from "react";

const useCounter = (initial = 0, inc = 1) => {
    const [count, setCount] = useState(initial);
    const inc = () => setCount(count + inc);
    return {
        count,
        inc,
    };
};

const [prxCounter] = createTestProxy(useCounter);

it("will increment by one", () => {
    {
        // Renders the hook inside of a component using 'react-test-renderer'
        // let root;
        // TestRenderer.act(() => root = TestRenderer.create(<CallbackComponent />));
        const { count, inc } = prxCounter();
        expect(count).toBe(0);
        // Function calls are wrapped TestRenderer.act(() => inc());
        inc();
    }

    {
        // TestRenderer.act(() => root.update(<CallbackComponent />);
        const { count } = prxCounter();
        expect(count).toBe(1);
    }
});
```

There are some caveats to this that only function calls are wrapped in act.
Namely setters are not wrapped in act so you'll have to wrap anything other than function calls.
With that being said most hooks don't bother with setters but if this is a an annoyance for you open a feature request.
