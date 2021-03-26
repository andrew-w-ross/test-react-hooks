import type { WrapApplyFn } from "../proxy";
import { wrapProxy } from "../proxy";

const wrapFn: WrapApplyFn = jest.fn((target, thisArg, args) => {
    return Reflect.apply(target, thisArg, args);
});

it("will ignore strings", () => {
    const value = "foo";
    const proxy = wrapProxy(value, wrapFn);

    expect(proxy).toBe(value);
    expect(wrapFn).not.toBeCalled();
});

it("will ignore booleans", () => {
    const value = true;
    const proxy = wrapProxy(value, wrapFn);

    expect(proxy).toBe(value);
    expect(wrapFn).not.toBeCalled();
});

it("will ignore dates", () => {
    const value = new Date("2019-01-12 22:12:12");
    const proxy = wrapProxy(value, wrapFn);

    expect(proxy).toBe(value);
    expect(wrapFn).not.toBeCalled();
});

it("will wrap promises", async () => {
    const value = Promise.resolve(12);
    const proxy = wrapProxy(value, wrapFn);

    expect(proxy).resolves.toBe(12);
});

it("will apply on promises with functions", async () => {
    const resolveObj = { calling: jest.fn() };
    const value = Promise.resolve(resolveObj);
    const proxy = wrapProxy(value, wrapFn);

    await proxy.then((v) => v.calling());
    expect(wrapFn).toHaveBeenCalledTimes(1);
});

it("will wrap functions", () => {
    const value = () => true;
    const proxy = wrapProxy(value, wrapFn);
    expect(proxy).not.toBe(value);
    expect(wrapFn).not.toBeCalled();

    expect(proxy()).toEqual(value());
    expect(wrapFn).toBeCalledTimes(1);
});

it("will wrap function results", () => {
    const value = () => () => {};
    const proxy = wrapProxy(value, wrapFn);
    expect(proxy).not.toBe(value);
    expect(wrapFn).not.toBeCalled();

    proxy()();
    expect(wrapFn).toBeCalledTimes(2);
});

it("can go deep", () => {
    const value = {
        a() {
            return {
                b() {
                    return "c";
                },
            };
        },
    };

    const proxy = wrapProxy(value, wrapFn);
    expect(proxy.a().b()).toBe("c");
    expect(wrapFn).toHaveBeenCalledTimes(2);
});
