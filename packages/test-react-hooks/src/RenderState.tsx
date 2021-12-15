import type { ReactNode } from "react";
import { Suspense, version } from "react";
import type {
    ReactTestRenderer,
    TestRendererOptions,
} from "react-test-renderer";
import { act, create } from "react-test-renderer";
import type { Subject } from "rxjs";
import { ErrorBoundary } from "./ErrorBoundary";
import type { UpdateEvent } from "./models";
import { randomNumber } from "./utils";

export class RenderState {
    private key = randomNumber() + "";
    private reactTestRenderer: ReactTestRenderer | null = null;
    private rendering = false;
    public isSuspended = false;

    constructor(
        private updateSubject: Subject<UpdateEvent>,
        private testRendererOptions?: TestRendererOptions,
    ) {}

    get isRendering() {
        return this.rendering;
    }

    render(element: ReactNode) {
        const renderElement = (
            <ErrorBoundary
                onError={(error) => this.updateSubject.next({ error })}
                key={this.key}
            >
                <Suspense fallback={false}>{element}</Suspense>
            </ErrorBoundary>
        );

        this.rendering = true;
        act(() => {
            if (this.reactTestRenderer == null) {
                this.reactTestRenderer = create(
                    renderElement,
                    this.testRendererOptions,
                );
            } else {
                this.reactTestRenderer.update(renderElement);
            }
        });
        this.rendering = false;
    }

    unmount() {
        if (version.startsWith("16")) {
            //Needed for react@16.14
            this.render(null);
        }
        act(() => {
            this.reactTestRenderer?.unmount();
        });
        this.reactTestRenderer = null;
        this.isSuspended = false;
    }
}
