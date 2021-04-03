import { useState, useEffect } from "react";
import { createTestProxy } from "../createTestProxy";
import { wait } from "../utils";

function useWaits() {
    const [value, setValue] = useState(0);

    useEffect(() => {
        wait(1).then(() => setValue(1));
        wait(10).then(() => setValue(10));
        wait(100).then(() => setValue(100));
    }, []);

    return value;
}

//If we failed to wrap async changes in act then it complains, just watching to make sure that didn't happen.
const errorSpy = jest.spyOn(console, "error");

beforeEach(() => {
    jest.useFakeTimers("modern");
});

afterEach(() => {
    jest.useRealTimers();
});

it("can use proxy timer in waiter fn", async () => {
    const [prxWaits, control] = createTestProxy(useWaits);

    {
        const value = prxWaits();
        expect(value).toBe(0);
    }

    await control.waitForNextUpdate(() => jest.advanceTimersByTime(2));

    {
        const value = prxWaits();
        expect(value).toBe(1);
    }

    await control.waitForNextUpdate(() => jest.advanceTimersByTime(10));

    {
        const value = prxWaits();
        expect(value).toBe(10);
    }

    expect(errorSpy).not.toHaveBeenCalled();
});

it("running all pending timers will skip to the end", async () => {
    const [prxWaits, control] = createTestProxy(useWaits, {
        throttleTime: null,
    });

    {
        const value = prxWaits();
        expect(value).toBe(0);
    }

    await control.waitForNextUpdate(() => jest.advanceTimersByTime(3));

    {
        const value = prxWaits();
        expect(value).toBe(1);
    }
    expect(errorSpy).not.toHaveBeenCalled();
});
