import { useEffect, useState } from "react";
import { createTestProxy } from "test-react-hooks";

import { wait } from "./util";

//This hook will return the number of times it's updated to a maximum of 3
//The ms argument is the wait time between updates
function useBatchAsync(ms) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const doStuff = async () => {
            for (let i = 0; i < 3; i++) {
                await wait(ms);
                setValue((v) => v + 1);
            }
        };

        doStuff();        
    }, [ms]);

    return value;
}

const [prxBatchAsync, control] = createTestProxy(useBatchAsync);

it("wait for next update by default will debounce for 2ms", async () => {
    {
        const value = prxBatchAsync(1);
        expect(value).toBe(0);
    }

    //By default this will wait for the control to stop updating for 2ms
    await control.waitForNextUpdate();

    {
        const value = prxBatchAsync(1);
        //Because the wait time is 1ms all three updates events will happen before the promise resolves
        expect(value).toBe(3);
    }
});

it("can wait for a specific amount of updates", () => {
    {
        const value = prxBatchAsync(5);
        expect(value).toBe(0);
    }

    //`waitForNextUpdate` actually returns a waiter, a fluent api that extends promise
    //Update count does exactly what's on the box, waits for a certain amount of updates before resolving
    await control.waitForNextUpdate().updateCount(1);

    {
        const value = prxBatchAsync(5);
        //Because the wait time is 1ms all three updates events will happen before the promise resolves
        expect(value).toBe(1);
    }

    //Here we wait for the other two updates
    await control.waitForNextUpdate().updateCount(2);

    {
        const value = prxBatchAsync(5);
        //Because the wait time is 1ms all three updates events will happen before the promise resolves
        expect(value).toBe(3);
    }
});

it('will wait for at least one update event', () => {
    const [prxBatchAsync, control] = createTestProxy(useBatchAsync);

    {
        const value = prxBatchAsync(600);
        expect(value).toBe(0);
    }

    //Even though the debounce time is 2ms it'll wait for an update
    await control.waitForNextUpdate();

    {
        const value = prxBatchAsync(600);
        expect(value).toBe(1);
    }
});
