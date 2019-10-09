import { RefObject, useEffect } from "react";
import { act } from "react-dom/test-utils";
import { createTestProxy } from "../createTestProxy";

//Taken from https://usehooks.com/useOnClickOutside/
function useOnClickOutside(ref: RefObject<Element>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as any)) {
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

const [prxClickOutside, control] = createTestProxy(useOnClickOutside);
const spy = jest.fn();

it("will detect if clicked outside", () => {
  const ref = { current: control.container };

  prxClickOutside(ref, spy);
  expect(spy).not.toHaveBeenCalled();

  act(() => {
    document.dispatchEvent(new Event("click"));
  });

  prxClickOutside(ref, spy);
  expect(spy).toHaveBeenCalled();
});

it("wont call if clicked internally", () => {
  const ref = { current: control.container };

  prxClickOutside(ref, spy);
  expect(spy).not.toHaveBeenCalled();

  act(() => {
    control.container.dispatchEvent(new Event("click"));
  });

  prxClickOutside(ref, spy);
  expect(spy).not.toHaveBeenCalled();
});

it("won't throw if ref isn't given", () => {
  const ref = { current: null };

  prxClickOutside(ref, spy);
  act(() => {
    document.dispatchEvent(new Event("click"));
  });
  expect(spy).not.toHaveBeenCalled();
});

it("will bind to new spy", () => {
  const newSpy = jest.fn();
  const ref = { current: control.container };
  prxClickOutside(ref, spy);
  prxClickOutside(ref, newSpy);
  act(() => {
    document.dispatchEvent(new Event("click"));
  });
  expect(spy).not.toHaveBeenCalled();
  expect(newSpy).toHaveBeenCalled();
});
