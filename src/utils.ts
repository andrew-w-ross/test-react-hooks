import { act } from "react-dom/test-utils";
import ReactDOM from "react-dom";

const TEST_ID = "__useTests_hook_component";

function getTestNodes() {
  const nodes = Array.from(document.querySelectorAll(`#${TEST_ID}`));
  if (nodes.length > 1) {
    console.error(
      "More than one node found in cleanup, ensure cleanup is called after every test"
    );
  }
  return nodes;
}

/**
 * Function to be called after your tests to cleanup the container created
 *
 * @export
 */
export function cleanUp() {
  getTestNodes().forEach(n => {
    unmount(n);
    n.remove();
  });
}

export function unmount(node = getContainer()) {
  act(() => {
    ReactDOM.unmountComponentAtNode(node);
  });
}

export function getContainer() {
  let [container] = getTestNodes();
  if (container != null) return container;
  container = document.createElement("div");
  container.id = TEST_ID;
  document.body.appendChild(container);
  return container;
}
