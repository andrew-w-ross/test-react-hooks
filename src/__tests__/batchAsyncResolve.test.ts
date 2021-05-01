import { useEffect, useRef, useState } from "react";
import { createTestProxy } from "../createTestProxy";
import { wait } from "../utils";

//Use real timers here, this library doesn't assume jest as a runner
function useBatchAsync(ms = 0) {
    const [value, setValue] = useState(0);
    const mounted = useRef(true);

    useEffect(() => {
        const run = async () => {
            for (let i = 0; i < 3; i++) {
                await wait(ms);
                if (!mounted.current) return;
                setValue((v) => v + 1);
            }
        };

        run();
        return () => {
            mounted.current = false;
        };
    }, [ms]);

    return value;
}

it("by default will wait for 2ms to pass before resoving", async () => {
    const [prxBatchAsync, control] = createTestProxy(useBatchAsync);
    {
        const value = prxBatchAsync();
        expect(value).toEqual(0);
    }

    await control.waitForNextUpdate();

    {
        const value = prxBatchAsync();
        expect(value).toEqual(3);
    }
});

it("can wait for single event", async () => {
    const [prxBatchAsync, control] = createTestProxy(useBatchAsync);

    {
        const value = prxBatchAsync(5);
        expect(value).toEqual(0);
    }

    await control.waitForNextUpdate().updateCount(1);

    {
        const value = prxBatchAsync(5);
        expect(value).toEqual(1);
    }

    await control.waitForNextUpdate().updateCount(2);

    {
        const value = prxBatchAsync(5);
        expect(value).toEqual(3);
    }
});

it(`regardless of the throttleTime it'll still wait for the first change`, async () => {
    const [prxBatchAsync, control] = createTestProxy(useBatchAsync);

    {
        const value = prxBatchAsync(10);
        expect(value).toBe(0);
    }

    await control.waitForNextUpdate();

    {
        const value = prxBatchAsync(10);
        expect(value).toBe(1);
    }
});
