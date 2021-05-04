import { resourceCache, useAsyncResource } from "use-async-resource";
import { createTestProxy } from "../createTestProxy";

const apiFn = (id: number) => Promise.resolve({ id });
const apiSimpleFn = () => Promise.resolve({ message: "success" });
const apiFailingFn = () => Promise.reject("Boom suspense");

afterEach(() => {
    resourceCache(apiFn).clear();
    resourceCache(apiSimpleFn).clear();
    resourceCache(apiFailingFn).clear();
});

const [prxAsyncResource, control] = createTestProxy(useAsyncResource);

it("should create a new data reader", async () => {
    // get the data reader from the custom hook, with params
    {
        const [dataReader] = prxAsyncResource(apiFn, 1);
        dataReader();
    }

    await control.waitForNextUpdate();

    {
        const [datReader] = prxAsyncResource(apiFn, 1);
        expect(datReader()).toEqual({ id: 1 });
    }
});
