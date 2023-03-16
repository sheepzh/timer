/**
 * Copyright (c) 2022 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"

/**
 * Transfer host info to label 
 */
export function labelOfHostInfo(hostInfo: TrendHostInfo): string {
    if (!hostInfo) return ''
    const { host, merged, virtual } = hostInfo
    if (!host) return ''
    let label = ''
    merged && (label = `[${t(msg => msg.trend.merged)}]`)
    virtual && (label = `[${t(msg => msg.trend.virtual)}]`)
    return `${host}${label}`
}
