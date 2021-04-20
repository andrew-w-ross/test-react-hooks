//If we failed to wrap async changes in act then it complains, just watching to make sure that didn't happen.
const errorSpy = jest.spyOn(console, "error");

afterEach(() => {
    expect(errorSpy).not.toHaveBeenCalledWith(
        expect.stringContaining(" was not wrapped in act(...)."),
    );
});
