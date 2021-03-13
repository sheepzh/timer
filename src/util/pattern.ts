/**
 * Test the url belongs to the browser
 * 
 * @param url 
 */
export function isBrowserUrl(url: string) {
    return [/^(chrome(-error)?):\/\/*$/g, /^about:.*$/]
        .map(p => p.test(url))
        .reduce((a, b) => a || b)
}