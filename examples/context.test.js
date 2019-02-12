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

  {
    const value = getResult();
    expect(value).toBe("Bar");
  }

  //Change the context value
  setContextVal("Foo");
  //Fetch the state of the context
  {
    const value = getResult();
    expect(value).toBe("Foo");
  }
});
