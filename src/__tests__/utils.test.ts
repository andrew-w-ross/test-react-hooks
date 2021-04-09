import { returnAct } from "../utils";

describe("returnAct", () => {
    it("return a sync value", () => {
        expect(returnAct(() => 1)).toBe(1);
    });

    it("returns an async value", async () => {
        const promiseAct = () => new Promise((resolve) => resolve(1));
        await expect(returnAct(promiseAct)).resolves.toBe(1);
    });

    it("will throw if act throws", () => {
        const errorFn = () => {
            throw new Error("boom");
        };
        expect(() => returnAct(errorFn)).toThrowError("boom");
    });
});
