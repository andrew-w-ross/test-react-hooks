# test-react-hooks

Simple testing for react hooks

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
  let [count] = getResult();
  expect(count).toBe(0);

  //This is the result after the change
  [count] = getResult(
    //changes can need to be passed run here
    ([, incFn]) => incFn()
  );
  expect(count).toBe(1);
});
```

How to test context

```javascript
import { useTestHook, cleanUp } from "test-react-hooks";
import { createContext, useContext } from "react";

//Cleans up the dom container that's created during testing
afterEach(() => cleanUp());

const TestContext = createContext();

// Create your hook
const contextHook = () => {
  return useContext(TestContext);
};

it("will get context value", () => {
  //Setup your hook
  const { getResult, setContextVal } = useTestHook(() => contextHook(), {
    context: TestContext, //Context to use
    contextVal: "Bar" //Initial Value
  });

  let value = getResult();
  expect(value).toBe("Bar");

  //Change the context value
  setContextVal("Foo");
  //Fetch the state of the context
  value = getResult();
  expect(value).toBe("Foo");
});
```

And with useEffect

```javascript
import { useTestHook, cleanUp } from "test-react-hooks";
import { useState, useEffect } from "react";

//Cleans up the dom container that's created during testing
afterEach(() => {
  cleanUp();
  listeners.length = 0;
});

const listeners = [];

const subscribe = cb => {
  console.log("Subscribed");
  listeners.push(cb);
  return () => {
    console.log("Unsubscribed");
    const index = listeners.indexOf(cb);
    listeners.splice(index, 1);
  };
};

const send = message => listeners.forEach(cb => cb(message));

// Create your hook
const lastMessageHook = () => {
  const [lastMessage, setLastMessage] = useState("");
  useEffect(() => {
    const cb = message => {
      console.log("Recieved ", message);
      setLastMessage(message);
    };
    return subscribe(cb);
  });

  return lastMessage;
};

it("will subscribe get the new messages and unsubscribe", () => {
  //Setup your hook
  const { getResult, unmount } = useTestHook(() => lastMessageHook());

  //Should see a subscribe
  let message = getResult();
  expect(message).toBe("");
  expect(listeners.length).toBe(1);

  //Should see an unsubscribe and a subscribe
  message = getResult(() => send("Foo"));
  expect(message).toBe("Foo");
  expect(listeners.length).toBe(1);

  unmount();
  expect(listeners.length).toBe(0);
});
```

## Api

This project is written in typescript so you should get documen
