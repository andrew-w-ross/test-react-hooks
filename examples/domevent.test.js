import { useEffect } from "react";
import { createTestProxy, act } from "test-react-hooks";
import { createSandboxClickEvent } from "./util";

//Taken from https://usehooks.com/useOnClickOutside/
function useOnClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }

            handler();
        };

        document.addEventListener("click", listener);
        return () => {
            document.removeEventListener("click", listener);
        };
    }, [ref, handler]);
}

const [prxClickOutside] = createTestProxy(useOnClickOutside);
const spy = jest.fn();

afterEach(() => jest.clearAllMocks());

const container = document.createElement("div");

beforeEach(() => {
    document.body.appendChild(container);
});

afterEach(() => {
    container.remove();
});

it("will detect if clicked outside", () => {
    const ref = { current: container };

    prxClickOutside(ref, spy);
    expect(spy).not.toHaveBeenCalled();

    //hook proxy doesn't wrap anything but the hook and it's members
    act(() => {
        document.dispatchEvent(createSandboxClickEvent());
    });

    prxClickOutside(ref, spy);
    expect(spy).toHaveBeenCalled();
});

it("wont call if clicked internally", () => {
    const ref = { current: container };

    prxClickOutside(ref, spy);
    expect(spy).not.toHaveBeenCalled();

    act(() => {
        container.dispatchEvent(createSandboxClickEvent());
    });

    prxClickOutside(ref, spy);
    expect(spy).not.toHaveBeenCalled();
});
