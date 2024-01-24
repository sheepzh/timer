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
    url: string
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

export function parseUrl(url: string): UrlInfo {
    if (!url) {
        return { protocol: null, url: null }
    }
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