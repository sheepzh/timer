import compile from "@i18n/chrome/compile"

test('1', () => {
    const messages = { app: '123', foo: { bar: '234' } }
    const chromeMessages = compile(messages)
    expect(chromeMessages.app.message).toEqual('123')
    expect(chromeMessages.foo_bar.message).toEqual('234')
})