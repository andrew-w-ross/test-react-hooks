import { useEffect } from "react";
import { createTestProxy } from "../createTestProxy";

/**
 * Just a general design goal for errors. Hooks shouldn't fail silently it should fail at the closest spot to invocation.
 * - If the error occurs in response to a hook call it should throw there
 * - If it happens on unmount it should throw on the call
 * - If it happens on an async wait it should reject
 * - Lastly on cleanup catch all errors
 */

type ThrowWhen = "render" | "aftermount" | "unmount";

function useError(when: ThrowWhen, deps: any[] = []) {
    if (when === "render") throw new Error(when);
    useEffect(() => {
        if (when === "aftermount") throw new Error(when);
        return () => {
            if (when === "unmount") {
                throw new Error(when);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [when, ...deps]);
}

const [prxError, control] = createTestProxy(useError);

it("will throw straight away", () => {
    expect(() => prxError("render")).toThrowError("render");
});

it("will throw after mount", () => {
    expect(() => prxError("aftermount")).toThrowError("aftermount");
});

it("will throw on unmount", () => {
    prxError("unmount");
    expect(() => control.unmount()).toThrowError("unmount");
});

it("will throw on deps change", () => {
    prxError("unmount", [1]);
    expect(() => prxError("unmount", [2])).toThrowError("unmount");
});
