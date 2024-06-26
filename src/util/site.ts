/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

const SEPARATORS = /[-\|–_:：，]/

const INVALID_SITE_NAME = /(登录)|(我的)|(个人)|(主页)|(首页)|(Welcome)/

const SPECIAL_MAP = {
    // 哔哩哔哩 (゜-゜)つロ 干杯~-bilibili
    'www.bilibili.com': 'bilibili'
}

/**
 * Extract the site name from the title of tab
 *
 * @param title title
 * @returns siteName, undefined if disable to detect
 * @since 0.5.1
 */
export function extractSiteName(title: string, host?: string) {
    title = title?.trim?.()
    if (!title) {
        return undefined
    }
    if (host && SPECIAL_MAP[host]) {
        return SPECIAL_MAP[host]
    }
    return title
        .split(SEPARATORS)
        .filter(s => !INVALID_SITE_NAME.test(s))
        .sort((a, b) => a.length - b.length)[0]
        ?.trim?.()
}

/**
 * Generate the label text with host and name
 *
 * @since 1.1.8
 */
export function generateSiteLabel(host: string, name?: string): string {
    if (name && host !== name) {
        return `${name} (${host})`
    } else {
        return host
    }
}
