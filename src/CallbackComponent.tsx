export type CallbackHookProps = {
    callback: Function;
};

export function CallbackComponent({ callback }: CallbackHookProps) {
    callback();
    return null;
}
