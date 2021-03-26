import { createContext, useContext } from "react";
import { createTestProxy } from "../createTestProxy";

const TestContext = createContext(0);

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

it("will warn if the wrapper does not pass on the children", () => {
    const [prxContext] = createTestProxy(useContext, {
        wrapper: () => <h1>Dont pass children</h1>,
    });
    const warnSpy = jest.spyOn(console, "warn");
    prxContext(TestContext);
    expect(warnSpy).toHaveBeenCalledWith(
        "Check the code for your wrapper, it should render the children prop",
    );
});
