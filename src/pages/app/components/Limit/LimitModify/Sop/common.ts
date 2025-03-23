/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * The protocol of rule host
 */
export type Protocol =
    | 'http://'
    | 'https://'
    | '*://'

export type UrlInfo = {
    protocol: Protocol
    parts: UrlPart[]
}

export type UrlPart = {
    /**
     * The origin part text
     */
    origin: string
    /**
     * Whether to replace with wildcard
     */
    ignored: boolean
}


function cleanUrl(url: string): string {
    if (!url) return url

    const querySign = url.indexOf('?')
    querySign > -1 && (url = url.substring(0, querySign))
    const hashSign = url.indexOf('#')
    hashSign > -1 && (url = url.substring(0, hashSign))
    return url
}

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
    url = cleanUrl(url)
    return { protocol, parts: url2Parts(url) }
}

const url2Parts = (url: string): UrlPart[] => {
    if (!url) return []
    return url.split('/')
        .filter(path => path)
        .map(path => ({ origin: path, ignored: path === '*' }))
}

export type StepFromInstance = {
    validate: () => boolean
}