import React, { createContext, useContext } from "react";
import { createTestProxy, cleanUp } from "test-react-hooks";

afterEach(() => cleanUp());

const TestContext = createContext(0);

const Wrapper = ({ val, children }) => (
    <TestContext.Provider value={val}>{children}</TestContext.Provider>
);

it("will get the default value", () => {
    const [prxContext] = createTestProxy(useContext);
    const res = prxContext(TestContext);
    expect(res).toBe(0);
});

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
