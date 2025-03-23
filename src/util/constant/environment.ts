/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getRuntimeId, getRuntimeName } from "@api/chrome/runtime"
import { CHROME_ID, E2E_NAME, EDGE_ID, FIREFOX_ID } from "./meta"

const { userAgent, platform } = navigator
let isFirefox = false
let isChrome = false
let isEdge = false
let isOpera = false
let isSafari = false
let browserMajorVersionStr: string | undefined

if (/Firefox[\/\s](\d+\.\d+)/.test(userAgent)) {
    isFirefox = true
    browserMajorVersionStr = /Firefox\/([0-9]+)/.exec(userAgent)?.[1]
} else if (userAgent.includes('Edg')) {
    // The Edge implements the chrome
    isEdge = true
    browserMajorVersionStr = /Edg\/([0-9]+)/.exec(userAgent)?.[1]
} else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    // The Opera implements the chrome
    isOpera = true
    browserMajorVersionStr = /OPR\/([0-9]+)/.exec(userAgent)?.[1] || /Opera\/([0-9]+)/.exec(userAgent)?.[1]
} else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    // Chrome on macOs includes 'Safari'
    isSafari = true
    browserMajorVersionStr = /Safari\/([0-9]+)/.exec(userAgent)?.[1]
} else if (userAgent.includes('Chrome')) {
    isChrome = true
    browserMajorVersionStr = /Chrome\/([0-9]+)/.exec(userAgent)?.[1]
}

export const IS_FIREFOX: boolean = isFirefox

export const IS_EDGE: boolean = isEdge

export const IS_CHROME: boolean = isChrome

/**
 * @since 3.3.0
 */
export const IS_ANDROID: boolean = !!userAgent?.toLowerCase()?.includes("android")

/**
 * @since 0.8.0
 */
export const IS_OPERA: boolean = isOpera

/**
 * @since 1.3.0
 */
export const IS_SAFARI: boolean = isSafari

let browserMajorVersion: number | undefined = undefined
try {
    browserMajorVersion = browserMajorVersionStr ? Number.parseInt(browserMajorVersionStr) : undefined
} catch (ignored) { }

/**
 * @since 1.3.2
 */
export const BROWSER_MAJOR_VERSION = browserMajorVersion

type NavigatorWithUAData = Navigator & {
    userAgentData?: {
        platform: string
    }
}

let isWindows = false
if (((navigator as unknown as NavigatorWithUAData)?.userAgentData)?.platform === 'Windows') {
    isWindows = true
} else if (platform?.startsWith('Win')) {
    isWindows = true
}

/**
 * @since 2.4.2
 */
export const IS_WINDOWS = isWindows

/**
 * @since 1.4.4
 */
export const IS_MV3 = chrome.runtime.getManifest().manifest_version === 3

const id = getRuntimeId()

/**
 * @since 0.9.6
 */
export const IS_FROM_STORE = (IS_CHROME && id === CHROME_ID)
    || (IS_EDGE && id === EDGE_ID)
    || (IS_FIREFOX && id === FIREFOX_ID)

export const IS_E2E = getRuntimeName() === E2E_NAME