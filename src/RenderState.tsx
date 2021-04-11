import type { ReactElement } from "react";
import type {
    ReactTestRenderer,
    TestRendererOptions,
} from "react-test-renderer";
import { act, create } from "react-test-renderer";
import { ErrorBoundary } from "./ErrorBoundary";
import { randomNumber } from "./utils";

export class RenderState {
    private key = randomNumber() + "";
    private reactTestRenderer: ReactTestRenderer | null = null;
    private element?: ReactElement;
    public caughtError?: Error;

    constructor(private testRendererOptions?: TestRendererOptions) {}

    render(element: ReactElement) {
        this.element = (
            <ErrorBoundary
                key={this.key}
                onError={(error) => {
                    this.caughtError = error;
                }}
            >
                {element}
            </ErrorBoundary>
        );

        act(() => {
            if (this.element == null) return;
            if (this.reactTestRenderer == null) {
                this.reactTestRenderer = create(
                    this.element,
                    this.testRendererOptions,
                );
            } else {
                this.reactTestRenderer.update(this.element);
            }
        });

        if (this.caughtError) throw this.caughtError;
    }

    unmount() {
        act(() => {
            this.reactTestRenderer?.unmount();
        });
        this.reactTestRenderer = null;
        if (this.caughtError) throw this.caughtError;
    }

    cleanup() {
        try {
            this.unmount();
        } catch (err) {}
    }
}
