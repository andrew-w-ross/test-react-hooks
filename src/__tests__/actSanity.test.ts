import { act } from "react-test-renderer";

//A bunch of sanity checks for the particulars of how act works.
//If these start to fail then a bunch of assumptions are wrong.
function testWait() {
    return new Promise<void>((resolve) => setImmediate(resolve));
}

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
        await testWait();
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
            await testWait();
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
    const errorSpy = spyOn(console, "error");
    const actResult = act(() => Promise.resolve(undefined));

    await testWait();
    expect(errorSpy).toBeCalledWith(
        expect.stringContaining(
            "You called act(async () => ...) without await",
        ),
    );
    await expect(actResult).resolves.toBeUndefined();
});
