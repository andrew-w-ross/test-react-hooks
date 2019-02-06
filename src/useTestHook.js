import React, { createContext } from "react";
import ReactDom from "react-dom";
//@ts-ignore
import { act } from "react-dom/test-utils";
const DefaultContext = createContext({});
const TEST_ID = "__useTests_hook_component";
let container = null;
export function cleanUp() {
    container = null;
    const elem = document.getElementById(TEST_ID);
    if (elem != null) {
        elem.remove();
    }
}
function ensureContainer() {
    if (container != null) {
        console.warn("Previous tests weren't cleaned up, use the cleanUp command after each test");
        cleanUp();
    }
    container = document.createElement("div");
    container.id = TEST_ID;
    document.body.appendChild(container);
}
export function useTestHook(setupFn, options = {}) {
    let { contextVal } = options;
    const { context: TestContext = DefaultContext, mountEager = true } = options;
    let res;
    let hasRendered = false;
    let val = 0;
    const testCallBack = () => {
        hasRendered = true;
        res = setupFn();
    };
    const TestComp = ({ val, callBack }) => {
        return (<>
        {val}
        {callBack()}
      </>);
    };
    const renderComp = () => act(() => {
        return ReactDom.render(
        //@ts-ignore
        <TestContext.Provider value={contextVal}>
          <TestComp val={val} callBack={testCallBack}/>
        </TestContext.Provider>, container);
    });
    ensureContainer();
    if (mountEager)
        renderComp();
    return {
        getResult: () => {
            if (!hasRendered)
                renderComp();
            return res;
        },
        unmount: () => {
            if (container != null) {
                ReactDom.unmountComponentAtNode(container);
            }
            return false;
        },
        mount: () => {
            renderComp();
        },
        flushEffects: () => {
            val++;
            renderComp();
        },
        setContextVal: (value) => {
            contextVal = value;
            renderComp();
        }
    };
}
