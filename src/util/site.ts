/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const SEPARATORS = /[-\|–_]/

const INVALID_SITE_NAME = /(登录)|(我的)|(个人)|(主页)|(首页)/

/**
 * Extract the site name from the title of tab
 * 
 * @param title title
 * @returns siteName, undefined if disable to detect
 * @since 0.5.1
 */
export function extractSiteName(title: string) {
    if (!title) {
        return undefined
    }
    return title
        .split?.(SEPARATORS)
        .filter?.(s => !INVALID_SITE_NAME.test(s))
        .sort?.((a, b) => a.length - b.length)[0]
        ?.trim()
        || undefined

}