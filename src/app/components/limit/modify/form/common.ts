export function parseUrl(url: string): UrlInfo {
    let protocol: Protocol = '*://'

    url = decodeURI(url)?.trim()
    if (url.startsWith('http://')) {
        protocol = 'http://'
        url = url.substring(protocol.length)
    } else if (url.startsWith('https://')) {
        protocol = 'https://'
        url = url.substring(protocol.length)
    } else if (url.startsWith('*://')) {
        protocol = '*://'
        url = url.substring(protocol.length)
    }
    return { protocol, url }
}