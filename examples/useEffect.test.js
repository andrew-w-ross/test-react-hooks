import { useTestHook, cleanUp } from "test-react-hooks";
import { useState, useEffect } from "react";

//Cleans up the dom container that's created during testing
afterEach(() => {
  cleanUp();
  listeners.length = 0;
});

const listeners = [];

const subscribe = cb => {
  console.log("Subscribed");
  listeners.push(cb);
  return () => {
    console.log("Unsubscribed");
    const index = listeners.indexOf(cb);
    listeners.splice(index, 1);
  };
};

const send = message => listeners.forEach(cb => cb(message));

// Create your hook
const lastMessageHook = () => {
  const [lastMessage, setLastMessage] = useState("");
  useEffect(() => {
    const cb = message => {
      console.log("Recieved ", message);
      setLastMessage(message);
    };
    return subscribe(cb);
  });

  return lastMessage;
};

it("will subscribe get the new messages and unsubscribe", () => {
  //Setup your hook
  const { getResult, unmount } = useTestHook(() => lastMessageHook());

  {
    //Should see a subscribe
    const message = getResult();
    expect(message).toBe("");
    expect(listeners.length).toBe(1);
  }

  {
    //Should see an unsubscribe and a subscribe
    const message = getResult(() => send("Foo"));
    expect(message).toBe("Foo");
    expect(listeners.length).toBe(1);
  }

  unmount();
  expect(listeners.length).toBe(0);
});
