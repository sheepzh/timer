/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"

const MERGED_FLAG = 'm'
const VIRTUAL_FLAG = 'v'
const NONE_FLAG = '_'

/**
 * site key => option value
 */
export function cvt2OptionValue(siteKey: timer.site.SiteKey): string {
    if (!siteKey) return ''
    const { merged, virtual } = siteKey
    let flag = NONE_FLAG
    merged && (flag = MERGED_FLAG)
    virtual && (flag = VIRTUAL_FLAG)
    return `${flag}${siteKey.host}`
}

/**
 * option value => site key
 */
export function cvt2SiteKey(optionValue: string): timer.site.SiteKey {
    const flag = optionValue.substring(0, 1)
    const host = optionValue.substring(1)
    if (flag === MERGED_FLAG) {
        return { host, merged: true }
    } else if (flag === VIRTUAL_FLAG) {
        return { host, virtual: true }
    } else {
        return { host }
    }
}

export const EXIST_MSG = t(msg => msg.siteManage.msg.existedTag)
export const MERGED_MSG = t(msg => msg.siteManage.type.merged?.name)?.toLocaleUpperCase?.()
export const VIRTUAL_MSG = t(msg => msg.siteManage.type.virtual?.name)?.toLocaleUpperCase?.()

/**
 * Calculate the label of alias key to display
 *
 * @returns
 *      1. www.google.com
 *      2. www.google.com[MERGED]
 *      4. www.google.com[EXISTED]
 *      5. www.github.com/sheepzh/*[VIRTUAL]
 *      5. www.github.com/sheepzh/*[VIRTUAL-EXISTED]
 *      3. www.google.com[MERGED-EXISTED]
 */
export function labelOf(siteKey: timer.site.SiteKey, exists?: boolean): string {
    let label = siteKey.host
    const suffix = []
    siteKey.merged && suffix.push(MERGED_MSG)
    siteKey.virtual && suffix.push(VIRTUAL_MSG)
    exists && suffix.push(EXIST_MSG)
    suffix.length && (label += `[${suffix.join('-')}]`)
    return label
}
