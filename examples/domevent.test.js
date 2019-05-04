import { useEffect } from "react";
import { useTestProxy, cleanUp, act } from "test-react-hooks";

afterEach(() => cleanUp());

//Taken from https://usehooks.com/useOnClickOutside/
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = event => {
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

const [prxClickOutside, control] = useTestProxy(useOnClickOutside);
const spy = jest.fn();

it("will detect if clicked outside", () => {
  const ref = { current: control.container };

  prxClickOutside(ref, spy);
  expect(spy).not.toHaveBeenCalled();

  //hook proxy doesn't wrap anything but the hook and it's members
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
