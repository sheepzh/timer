/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"

/**
 * key => value
 */
export function optionValueOf(aliasKey: timer.site.AliasKey): string {
    if (!aliasKey) return ''
    return `${aliasKey.merged ? 'm' : '_'}${aliasKey.host}`
}

/**
 * value => key
 */
export function aliasKeyOf(value: string): timer.site.AliasKey {
    const merged = value.startsWith('m')
    const host = value.substring(1)
    return { host, merged }
}

export const EXIST_MSG = t(msg => msg.siteManage.msg.existedTag)
export const MERGED_MSG = t(msg => msg.siteManage.msg.mergedTag)

/**
 * Calclate the label of alias key to display
 * 
 * @returns 
 *      1. www.google.com
 *      2. www.google.com[MERGED]
 *      4. www.google.com[EXISTED]
 *      3. www.google.com[MERGED-EXISTED]
 */
export function labelOf(aliasKey: timer.site.AliasKey, exists?: boolean): string {
    let label = aliasKey.host
    const suffix = []
    aliasKey.merged && suffix.push(MERGED_MSG)
    exists && suffix.push(EXIST_MSG)
    suffix.length && (label += `[${suffix.join('-')}]`)
    return label
}
