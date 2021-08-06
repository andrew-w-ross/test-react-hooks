import { useEffect, useState } from "react";
import { createTestProxy } from "test-react-hooks";

function useAsync(fn) {
    const [value, setValue] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(true);
        fn().then((v) => {
            setValue(v);
            setIsLoading(false);
        });
    }, [fn]);
    return {
        value,
        isLoading,
    };
}

const [prxAsync, control] = createTestProxy(useAsync);

it("will wait for update", async () => {
    const prxSpy = jest.fn(() => Promise.resolve("foo"));

    {
        const { value, isLoading } = prxAsync(prxSpy);
        expect(value).toBeNull();
        expect(isLoading).toBe(true);
    }

    //Wait for next update will wait for the next time the component updates
    await control.waitForNextUpdate();

    {
        const { value, isLoading } = prxAsync(prxSpy);
        expect(value).toBe("foo");
        expect(isLoading).toBe(false);
    }
});
