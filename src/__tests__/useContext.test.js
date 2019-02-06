import { createContext, useContext } from "react";
import { useTestHook } from "../useTestHook";
const TestContext = createContext(0);
it("will get default value", () => {
    const { getResult } = useTestHook(() => useContext(TestContext), {
        context: TestContext
    });
    let result = getResult();
    expect(result).toBe(undefined);
});
it("will use initial value", () => {
    const { getResult } = useTestHook(() => useContext(TestContext), {
        context: TestContext,
        contextVal: 2
    });
    let result = getResult();
    expect(result).toBe(2);
});
it("will update context value", () => {
    const { getResult, setContextVal } = useTestHook(() => useContext(TestContext), { context: TestContext });
    let result = getResult();
    expect(result).toBeUndefined();
    setContextVal(3);
    result = getResult();
    expect(result).toBe(3);
});
