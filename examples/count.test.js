import { useTestProxy, cleanUp } from "test-react-hooks";
import { useState } from "react";

//Cleans up the dom container that's created during testing
afterEach(() => cleanUp());

// Create your hook
const useCounter = (initial = 0, inc = 1) => {
  const [count, setCount] = useState(initial);
  const inc = () => setCount(count + inc);
  return {
    count,
    inc
  };
};

//Proxy of your hook, use it like you would in a component
//Internally calls render for the hook and act on everything else
const [prxCounter] = useTestProxy(useCounter);

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
