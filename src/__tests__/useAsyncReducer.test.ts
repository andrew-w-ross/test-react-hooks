import { useEffect, useReducer } from "react";
import { createTestProxy } from "../createTestProxy";

type State = {
    isLoading: boolean;
    result?: any;
    error?: any;
};

const initialState: State = {
    isLoading: false,
};
type Actions =
    | {
          type: "start";
      }
    | {
          type: "finish";
          result: any;
      }
    | {
          type: "error";
          error: any;
      };

function reducer(state: State, action: Actions): State {
    switch (action.type) {
        case "start":
            return {
                isLoading: true,
            };
        case "finish":
            return {
                isLoading: false,
                result: action.result,
            };
        case "error":
            return {
                isLoading: false,
                error: action.error,
            };
        default:
            return state;
    }
}

function useAsyncReducer(fn: () => Promise<any>) {
    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        dispatch({ type: "start" });
        fn()
            .then((result) => {
                dispatch({ type: "finish", result });
            })
            .catch((error) => {
                dispatch({ type: "error", error });
            });
    }, [fn]);
    return state;
}

const [prxAsyncReducer, control] = createTestProxy(useAsyncReducer);
const errorSpy = jest.spyOn(console, "error");

xit("will resolve with a result", async () => {
    const prxySpy = jest.fn(() => Promise.resolve("foo"));
    {
        const result = prxAsyncReducer(prxySpy);
        expect(result).toEqual({
            isLoading: true,
            result: undefined,
            error: undefined,
        });
    }

    await control.waitForNextUpdate();

    {
        const result = prxAsyncReducer(prxySpy);
        expect(result).toEqual({
            isLoading: false,
            result: "foo",
            error: undefined,
        });
    }
    expect(errorSpy).not.toBeCalled();
});

it("will resolve with an error", async () => {
    const prxySpy = jest.fn(() => Promise.reject("error"));
    {
        const result = prxAsyncReducer(prxySpy);
        expect(result).toEqual({
            isLoading: true,
            result: undefined,
            error: undefined,
        });
    }

    await control.waitForNextUpdate();

    {
        const result = prxAsyncReducer(prxySpy);
        expect(result).toEqual({
            isLoading: false,
            result: undefined,
            error: "error",
        });
    }
    expect(errorSpy).not.toBeCalled();
});
