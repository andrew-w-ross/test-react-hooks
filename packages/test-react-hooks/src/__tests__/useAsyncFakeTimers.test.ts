import { useState } from "react";
import { createTestProxy } from "../createTestProxy";
import { wait } from "../utils";

function useWaits() {
    const [value, setValue] = useState(0);

    wait(1).then(() => setValue(1));
    wait(10).then(() => setValue(10));
    wait(100).then(() => setValue(100));

    return value;
}

beforeEach(() => {
    jest.useFakeTimers("modern");
});

afterEach(() => {
    jest.useRealTimers();
});

const [prxWaits, control] = createTestProxy(useWaits);
it("can use proxy timer in waiter fn", async () => {
    {
        const value = prxWaits();
        expect(value).toBe(0);
    }

    await control
        .waitForNextUpdate()
        .addWaiter(async () => jest.advanceTimersByTime(2));

    {
        const value = prxWaits();
        expect(value).toBe(1);
    }

    await control
        .waitForNextUpdate()
        .addWaiter(async () => jest.advanceTimersByTime(10));

    {
        const value = prxWaits();
        expect(value).toBe(10);
    }
});

it("running all pending timers will skip to the end", async () => {
    {
        const value = prxWaits();
        expect(value).toBe(0);
    }

    await control
        .waitForNextUpdate()
        .addWaiter(async () => jest.runOnlyPendingTimers());

    {
        const value = prxWaits();
        expect(value).toBe(100);
    }
});
