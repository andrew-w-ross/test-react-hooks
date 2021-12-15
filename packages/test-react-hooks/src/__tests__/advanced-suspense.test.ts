import { resourceCache, useAsyncResource } from "use-async-resource";
import { createTestProxy } from "../createTestProxy";
import { AlreadySuspendedError, SUSPENDED } from "../models";

const apiFn = (id: number) => Promise.resolve({ id });
const apiSimpleFn = () => Promise.resolve({ message: "success" });
const apiFailingFn = () => Promise.reject("Boom Suspense");

afterEach(() => {
    resourceCache(apiFn).clear();
    resourceCache(apiSimpleFn).clear();
    resourceCache(apiFailingFn).clear();
});

describe("strict", () => {
    const [prxAsyncResource, control] = createTestProxy(useAsyncResource);

    it("should create a simple data reader", async () => {
        {
            const [dataReader] = prxAsyncResource(apiSimpleFn, []);
            expect(dataReader()).toBe(SUSPENDED);
        }

        await control.waitForNextUpdate();

        {
            const [datReader] = prxAsyncResource(apiSimpleFn, []);
            expect(datReader()).toEqual({ message: "success" });
        }
    });

    it("should create a new data reader", async () => {
        // get the data reader from the custom hook, with params
        {
            const [dataReader] = prxAsyncResource(apiFn, 1);
            expect(dataReader()).toBe(SUSPENDED);
        }

        await control.waitForNextUpdate();

        {
            const [datReader] = prxAsyncResource(apiFn, 1);
            expect(datReader()).toEqual({ id: 1 });
        }
    });

    it("should reject on suspension resulting in an error", async () => {
        // get the data reader from the custom hook, with params
        {
            const [dataReader] = prxAsyncResource(apiFailingFn, []);
            expect(dataReader()).toBe(SUSPENDED);
        }

        await expect(control.waitForNextUpdate()).rejects.toBe("Boom Suspense");
    });

    it("does not allow for double suspense", async () => {
        const [dataReader] = prxAsyncResource(apiSimpleFn, []);
        expect(dataReader()).toBe(SUSPENDED);
        expect(dataReader).toThrowError(AlreadySuspendedError);
    });

    it("should trigger an update for the data reader", async () => {
        {
            const [dataReader, updateDataReader] = prxAsyncResource(apiFn, 1);
            expect(dataReader()).toBe(SUSPENDED);

            await control.waitForNextUpdate();

            expect(dataReader()).toEqual({ id: 1 });
            updateDataReader(2);
        }

        {
            const [dataReader] = prxAsyncResource(apiFn, 1);
            expect(dataReader()).toBe(SUSPENDED);

            await control.waitForNextUpdate();

            expect(dataReader((u) => u.id)).toStrictEqual(2);
        }
    });
});

describe("loose", () => {
    const warnSpy = jest.spyOn(console, "warn");

    it("does allow for double suspense", async () => {
        const [prxLooseAsyncResource, control] = createTestProxy(
            useAsyncResource,
            {
                strict: false,
            },
        );

        {
            const [dataReader] = prxLooseAsyncResource(apiSimpleFn, []);
            expect(dataReader()).toBe(SUSPENDED);
            expect(warnSpy).not.toHaveBeenCalled();

            expect(dataReader()).toBe(SUSPENDED);
            expect(warnSpy).toHaveBeenCalledWith(
                expect.stringContaining("called while the hook was suspended"),
            );
        }

        await control.waitForNextUpdate();

        {
            const [dataReader] = prxLooseAsyncResource(apiSimpleFn, []);
            expect(dataReader()).toEqual({ message: "success" });
        }
    });
});

describe("autoInvokeSuspense off", () => {
    it("will not reject the waiter", async () => {
        const [prxNoInvokeAsyncResource, control] = createTestProxy(
            useAsyncResource,
            {
                autoInvokeSuspense: false,
            },
        );

        {
            const [dataReader] = prxNoInvokeAsyncResource(apiFailingFn, []);
            expect(dataReader()).toBe(SUSPENDED);
        }

        await control.waitForNextUpdate();

        {
            const [dataReader] = prxNoInvokeAsyncResource(apiFailingFn, []);
            expect(dataReader).toThrowError("Boom Suspense");
        }
    });
});
