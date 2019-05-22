const React = require("react");
const { act } = require("react-dom/test-utils");

//Maybe it shouldn't be a proxy?
const reactHandler = {
  apply(target, thisArg, argArray) {
    const result = Reflect.apply(target, thisArg, argArray);
    result[1] = new Proxy(result[1], actHandler);
    return result;
  }
};

const actHandler = {
  apply(target, thisArg, argArray) {
    let result;
    act(() => {
      result = Reflect.apply(target, thisArg, argArray);
    });
    return result;
  }
};

React.useState = new Proxy(React.useState, reactHandler);
React.useReducer = new Proxy(React.useReducer, reactHandler);
