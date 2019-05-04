jest.dontMock("react");

const React = require("react");
const { act } = require("react-dom/test-utils");

const reactHandler = {
  get(target, p, receiver) {
    const result = Reflect.get(target, p, receiver);
    return result === React.useState ? new Proxy(result, reactHandler) : result;
  },
  apply(target, thisArg, argArray) {
    const result = Reflect.apply(target, thisArg, argArray);
    if (target === React.useState && Array.isArray(result)) {
      result[1] = new Proxy(result[1], actHandler);
    }
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

module.exports = new Proxy(React, reactHandler);
