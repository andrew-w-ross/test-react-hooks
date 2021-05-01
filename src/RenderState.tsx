import type { ReactElement } from "react";
import type {
    ReactTestRenderer,
    TestRendererOptions,
} from "react-test-renderer";
import { act, create } from "react-test-renderer";
import type { Subject } from "rxjs";
import { ErrorBoundary } from "./ErrorBoundary";
import type { UpdateEvent } from "./updateWaiter";
import { randomNumber } from "./utils";

export class RenderState {
    private key = randomNumber() + "";
    private reactTestRenderer: ReactTestRenderer | null = null;
    private element?: ReactElement;

    constructor(
        private updateSubject: Subject<UpdateEvent>,
        private testRendererOptions?: TestRendererOptions,
    ) {}

    render(element: ReactElement) {
        this.element = (
            <ErrorBoundary
                onError={(error) => this.updateSubject.next({ error })}
                key={this.key}
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
    }

    unmount() {
        act(() => {
            this.reactTestRenderer?.unmount();
        });
        this.reactTestRenderer = null;
    }
}
