/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const { userAgent } = navigator
let isFirefox = false
let isChrome = false
let isEdge = false
let isOpera = false
let isSafari = false
let browserMajorVersion = undefined

if (/Firefox[\/\s](\d+\.\d+)/.test(userAgent)) {
    isFirefox = true
    browserMajorVersion = /Firefox\/([0-9]+)/.exec(userAgent)?.[1]
} else if (userAgent.includes('Edg')) {
    // The Edge implements the chrome
    isEdge = true
    browserMajorVersion = /Edg\/([0-9]+)/.exec(userAgent)?.[1]
} else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    // The Opera implements the chrome
    isOpera = true
    browserMajorVersion = /OPR\/([0-9]+)/.exec(userAgent)?.[1] || /Opera\/([0-9]+)/.exec(userAgent)?.[1]
} else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    // Chrome on macOs includes 'Safari'
    isSafari = true
    browserMajorVersion = /Safari\/([0-9]+)/.exec(userAgent)?.[1]
} else if (userAgent.includes('Chrome')) {
    isChrome = true
    browserMajorVersion = /Chrome\/([0-9]+)/.exec(userAgent)?.[1]
}

try {
    browserMajorVersion && (browserMajorVersion = Number.parseInt(browserMajorVersion))
} catch (ignored) { }

export const IS_FIREFOX: boolean = isFirefox

export const IS_EDGE: boolean = isEdge

export const IS_CHROME: boolean = isChrome

/**
 * @since 0.8.0
 */
export const IS_OPERA: boolean = isOpera

/**
 * @since 1.3.0
 */
export const IS_SAFARI: boolean = isSafari

/**
 * @since 1.3.2
 */
export const BROWSER_MAJOR_VERSION = browserMajorVersion

/**
 * @since 1.4.4
 */
export const IS_MV3 = chrome.runtime.getManifest().manifest_version === 3