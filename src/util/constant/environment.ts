/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { CHROME_ID, EDGE_ID, FIREFOX_ID } from "./meta"

const { userAgent } = navigator
let isFirefox = false
let isChrome = false
let isEdge = false
let isOpera = false

if (/Firefox[\/\s](\d+\.\d+)/.test(userAgent)) {
    isFirefox = true
} else if (userAgent.includes('Edg')) {
    // The Edge implements the chrome
    isEdge = true
} else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    // The Opera implements the chrome
    isOpera = true
} else if (userAgent.includes('Chrome')) {
    isChrome = true
}

export const IS_FIREFOX: boolean = isFirefox

export const IS_EDGE: boolean = isEdge

export const IS_CHROME: boolean = isChrome

/**
 * @since 0.8.0
 */
export const IS_OPERA: boolean = isOpera