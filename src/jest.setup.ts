//Failing to wrap an act is not acceptable this will ensure it's followed
const errorSpy = jest.spyOn(console, "error");

afterEach(() => {
    expect(errorSpy).not.toHaveBeenCalledWith(expect.stringContaining("act("));
});
