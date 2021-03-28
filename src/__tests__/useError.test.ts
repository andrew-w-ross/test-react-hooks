import { useEffect } from "react";
import { createTestProxy } from "../createTestProxy";

type ThrowWhen = "render" | "aftermount" | "unmount" | "async";

function useError(when: ThrowWhen, deps: any[] = []) {
    if (when === "render") throw new Error(when);
    useEffect(() => {
        if (when === "aftermount") throw new Error(when);
        return () => {
            throw new Error(when);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [when, ...deps]);
}

const [prxError, control] = createTestProxy(useError);

const errorSpy = jest.spyOn(console, "error");

it("will throw straight away", () => {
    expect(() => prxError("render")).toThrowError("render");
    expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining("The above error occurred in the"),
    );
});

it("will throw after mount", () => {
    expect(() => prxError("aftermount")).toThrowError("aftermount");
    expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining("The above error occurred in the"),
    );
});

it("will throw on unmount", () => {
    prxError("unmount");
    control.unmount();
    expect(control.error).toEqual(
        expect.objectContaining({ message: "unmount" }),
    );
});

it("will throw on deps change", () => {
    prxError("unmount", [1]);
    expect(control.error).toBeNull();

    expect(() => prxError("unmount", [2])).toThrowError();
    expect(control.error).not.toBeNull();
    expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining("The above error occurred in the"),
    );
});
