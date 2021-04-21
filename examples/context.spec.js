import React, { createContext, useContext } from "react";
import { createTestProxy } from "test-react-hooks";

const TestContext = createContext(0);

it("will get the default value", () => {
    const [prxContext] = createTestProxy(useContext);
    const res = prxContext(TestContext);
    expect(res).toBe(0);
});

//If you need a wrapping component to the hook use the wrapper option
//Or update the wrapper prop on the control object
//Don't forget to pass through the children or the proxyHook will fail
it("will get the value from the above context", () => {
    const [prxContext, control] = createTestProxy(useContext, {
        wrapper: ({ children }) => (
            <TestContext.Provider value={2}>{children}</TestContext.Provider>
        ),
    });
    {
        const res = prxContext(TestContext);
        expect(res).toBe(2);
    }
    {
        control.wrapper = ({ children }) => (
            <TestContext.Provider value={3}>{children}</TestContext.Provider>
        );
        const res = prxContext(TestContext);
        expect(res).toBe(3);
    }
});
