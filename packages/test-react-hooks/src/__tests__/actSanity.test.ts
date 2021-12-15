import { act } from "react-test-renderer";
import { wait } from "../utils";

it("will work with sync values", () => {
    let value = null;
    act(() => {
        value = 1;
    });
    expect(value).toBe(1);
});

it("will work with async values", async () => {
    let value = null;
    await act(async () => {
        await wait();
        value = 1;
    });
    expect(value).toEqual(1);
});

it("throws sync error", async () => {
    const testFn = () => {
        act(() => {
            throw new Error("sync error");
        });
    };

    expect(testFn).toThrow("sync error");
});

it("throws async error", async () => {
    const testFn = async () => {
        await act(async () => {
            await wait();
            throw new Error("async error");
        });
    };

    await expect(testFn).rejects.toThrow("async error");
});

it("will not return the result of the inner function", async () => {
    //@ts-expect-error
    const result = act(async () => 1);
    await expect(result).resolves.toBeUndefined();
});

it("gives an error if not awaited", async () => {
    const errorSpy = jest.spyOn(console, "error");
    const actResult = act(() => Promise.resolve(undefined));

    await wait();
    expect(errorSpy).toBeCalledWith(
        expect.stringContaining(
            "You called act(async () => ...) without await",
        ),
    );
    await expect(actResult).resolves.toBeUndefined();
});
