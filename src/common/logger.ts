/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const STORAGE_KEY = "_logOpen"
const STORAGE_VAL = "1"

let OPEN_LOG = localStorage.getItem(STORAGE_KEY) === STORAGE_VAL

/**
 * @since 0.0.4
 * @param args arguments
 */
export function log(...args: any) {
    OPEN_LOG && console.log(...args)
}

/**
 * @since 0.0.4
 */
export function openLog(): string {
    OPEN_LOG = true
    localStorage.setItem(STORAGE_KEY, STORAGE_VAL)
    return 'Opened the log manually.'
}

/**
 * @since 0.0.8
 */
export function closeLog(): string {
    OPEN_LOG = false
    localStorage.removeItem(STORAGE_KEY)
    return 'Closed the log manually.'
}