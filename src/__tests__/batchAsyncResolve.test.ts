import { useEffect, useRef, useState } from "react";
import { createTestProxy } from "../createTestProxy";

//Use real timers here, this library doesn't assume jest as a runner
function useBatchAsync(ms = 1) {
    const [value, setValue] = useState(0);
    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        for (let i = 1; i <= 3; i++) {
            setTimeout(() => {
                //Don't set if not mounted
                if (mounted.current) {
                    setValue((i) => i + 1);
                }
            }, i * ms);
        }
        return () => {
            mounted.current = false;
        };
    }, [ms]);

    return value;
}

const [prxBatchAsync, control] = createTestProxy(useBatchAsync);
it("by default will wait for 2ms to pass before resoving", async () => {
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

it("will run batch async operations", async () => {
    {
        const result = prxBatchAsync(5);
        //Initial value
        expect(result).toEqual(0);
    }

    await control.waitForNextUpdate().debounce(6);

    {
        const result = prxBatchAsync(5);
        expect(result).toEqual(3);
    }
});

it("can wait for single event", async () => {
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

const wait = (ms = 10) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

it("will use the custom waiter function", async () => {
    {
        const value = prxBatchAsync();
        expect(value).toEqual(0);
    }

    await control.waitForNextUpdate().addWaiter(() => wait());

    {
        const value = prxBatchAsync();
        expect(value).toEqual(3);
    }
});
