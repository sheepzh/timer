/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * Dark mode
 *
 * @since 1.1.0
 */

const THEME_ATTR = "data-theme"
const DARK_VAL = "dark"
const STORAGE_KEY = "isDark"
const STORAGE_FLAG = "1"

function toggle0(isDarkMode: boolean, el?: Element) {
    el = el || document.getElementsByTagName("html")?.[0]
    el.setAttribute(THEME_ATTR, isDarkMode ? DARK_VAL : "")
}

/**
 * Init from local storage
 */
export function init(el?: Element) {
    const val = isDarkMode()
    toggle0(val, el)
    return val
}

export function toggle(isDarkMode: boolean, el?: Element) {
    toggle0(isDarkMode, el)
    localStorage.setItem(STORAGE_KEY, isDarkMode ? STORAGE_FLAG : '')
}

export function isDarkMode() {
    return localStorage.getItem(STORAGE_KEY) === STORAGE_FLAG
}