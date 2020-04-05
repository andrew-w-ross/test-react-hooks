import { useReducer } from "react";
import { createTestProxy } from "../createTestProxy";

const initialState = { count: 0 };
type Action = {
  type: "increment" | "decrement";
};

function reducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

const [prxReducer] = createTestProxy(useReducer);

it("will have initial state", () => {
  const [state] = prxReducer(reducer, initialState);
  expect(state.count).toBe(0);
});

it("will dispatch", () => {
  {
    const [, dispatch] = prxReducer(reducer, initialState);
    dispatch({ type: "increment" });
  }
  {
    const [state] = prxReducer(reducer, initialState);
    expect(state.count).toBe(1);
  }
});

it("will handle multiple dispatches", () => {
  const [, dispatch] = prxReducer(reducer, initialState);
  dispatch({ type: "increment" });
  dispatch({ type: "increment" });
  dispatch({ type: "increment" });
  dispatch({ type: "decrement" });

  const [state] = prxReducer(reducer, initialState);
  expect(state.count).toBe(2);
});

it("will pass back the error", () => {
  const [, dispatch] = prxReducer(reducer, initialState);
  //@ts-ignore
  expect(() => dispatch({ type: "foo" })).toThrow();
});

it("will handle lazy initialization", () => {
  const spy = jest.fn(() => ({ count: -1 }));
  {
    const [state, dispatch] = prxReducer(reducer, initialState, spy);
    expect(state.count).toBe(-1);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(initialState);
    dispatch({ type: "decrement" });
  }

  {
    const [state] = prxReducer(reducer, initialState, spy);
    expect(spy).toBeCalledTimes(1);
    expect(state.count).toBe(-2);
  }
});
