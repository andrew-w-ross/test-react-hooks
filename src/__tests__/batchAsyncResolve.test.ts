import { useEffect, useState } from "react";
import { createTestProxy } from "../createTestProxy";
import { wait } from "../utils";

function useBatchAsync(ms = 1) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const doStuff = async () => {
            for (let i = 0; i < 2; i++) {
                await wait(ms);
                setValue((v) => v + 1);
            }
        };

        doStuff();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return value;
}

//If we failed to wrap async changes in act then it complains, just watching to make sure that didn't happen.
const errorSpy = jest.spyOn(console, "error");

it("by default will wait for 2ms to pass before resoving", async () => {
    const [prxBatchAsync, control] = createTestProxy(useBatchAsync);
    {
        const value = prxBatchAsync();
        expect(value).toBe(0);
    }

    await control.waitForNextUpdate();

    {
        const value = prxBatchAsync();
        expect(value).toBe(2);
    }

    expect(errorSpy).not.toHaveBeenCalled();
});

it("can be turned off for all updates by setting throttleTimeout to null", async () => {
    const [prxBatchAsync, control] = createTestProxy(useBatchAsync, {
        throttleFn: null,
    });

    {
        const value = prxBatchAsync(0);
        expect(value).toBe(0);
    }

    await control.waitForNextUpdate();

    {
        const value = prxBatchAsync();
        expect(value).toBe(1);
    }

    await control.waitForNextUpdate();

    {
        const value = prxBatchAsync();
        expect(value).toBe(2);
    }
    expect(errorSpy).not.toHaveBeenCalled();
});
