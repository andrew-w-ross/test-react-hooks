import { create } from "react-test-renderer";
import { ErrorBoundary } from "../ErrorBoundary";

const error = new Error("Boom");

const ThrowComponent = () => {
    throw error;
};

it(`render's content`, () => {
    const testRenderer = create(
        <ErrorBoundary>
            <h1>Test Content</h1>
        </ErrorBoundary>,
    );
    expect(testRenderer.root.findByType("h1").props).toEqual({
        children: "Test Content",
    });
});

it(`will render nothing on error`, () => {
    const onError = jest.fn();
    const testRenderer = create(
        <ErrorBoundary onError={onError}>
            <h1>Test Content</h1>
            <ThrowComponent />
        </ErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledWith(error);
    expect(testRenderer.root.findAllByType("h1")).toHaveLength(0);
});
