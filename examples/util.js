//new Event("click") explodes in sandbox so super old school it is
export function createSandboxClickEvent() {
    const mouseEvent = document.createEvent("MouseEvents");
    mouseEvent.initMouseEvent(
        "click",
        true,
        true,
        window,
        0,
        0,
        0,
        80,
        20,
        false,
        false,
        false,
        false,
        0,
        null,
    );
    return mouseEvent;
}
