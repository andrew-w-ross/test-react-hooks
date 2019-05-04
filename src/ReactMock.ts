//@ts-ignore
if (global["jest"] != null) {
  jest.dontMock("react");
} else {
  console.warn("This mock has only been tested with jest, careful");
}

const React = require("react");
const { act } = require("react-dom/test-utils");

const reactHandler: ProxyHandler<any> = {
  get(target: any, p: PropertyKey, receiver: any) {
    const result = Reflect.get(target, p, receiver);
    return result === React.useState ? new Proxy(result, reactHandler) : result;
  },
  apply(target: any, thisArg: any, argArray?: any) {
    const result = Reflect.apply(target, thisArg, argArray);
    if (target === React.useState && Array.isArray(result)) {
      result[1] = new Proxy(result[1], actHandler);
    }
    return result;
  }
};

const actHandler: ProxyHandler<any> = {
  apply(target: any, thisArg: any, argArray?: any) {
    let result;
    act(() => {
      result = Reflect.apply(target, thisArg, argArray);
    });
    return result;
  }
};

module.exports = new Proxy(React, reactHandler);
