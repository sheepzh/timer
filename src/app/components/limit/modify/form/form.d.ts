/**
 * Copyright (c) 2023 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

declare type FormInfo = {
    /**
     * Time / seconds
     */
    timeLimit: number
    /**
     * Protocol + path
     */
    condition: string
}

declare type UrlPart = {
    /**
     * The origin part text
     */
    origin: string
    /**
     * Whether to replace with wildcard
     */
    ignored: boolean
}

declare type UrlInfo = {
    protocol: Protocol
    url: string
}

/**
 * The protocol of rule host
 */
declare type Protocol =
    | 'http://'
    | 'https://'
    | '*://'
