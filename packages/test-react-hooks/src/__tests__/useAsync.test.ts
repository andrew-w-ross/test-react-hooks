import { useEffect, useState } from "react";
import { createTestProxy } from "../";

function useAsync(fn: () => Promise<any>) {
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
const prxySpy = () => Promise.resolve("foo");

it("will wait for update", async () => {
    {
        const { value, isLoading } = prxAsync(prxySpy);
        expect(value).toBeNull();
        expect(isLoading).toBe(true);
    }

    await control.waitForNextUpdate();

    {
        const { value, isLoading } = prxAsync(prxySpy);
        expect(value).toBe("foo");
        expect(isLoading).toBe(false);
    }
});
