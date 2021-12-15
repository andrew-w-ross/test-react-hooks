import type { FC } from "react";
import { createTestProxy } from "../createTestProxy";

const refObject = {};
const wrapperRefSpy = jest.fn();
const createNodeMockSpy = jest.fn(() => refObject);

const Wrapper: FC = ({ children }) => <div ref={wrapperRefSpy}>{children}</div>;

const [prxTestRef] = createTestProxy(() => {}, {
    testRendererOptions: {
        createNodeMock: createNodeMockSpy,
    },
    wrapper: Wrapper,
});

it("will use the createNodeMock to create a ref", () => {
    prxTestRef();
    expect(createNodeMockSpy).toHaveBeenCalledTimes(1);
    expect(wrapperRefSpy).toHaveBeenCalledWith(refObject);
});
