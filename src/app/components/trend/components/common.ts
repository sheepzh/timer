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
export function labelOfHostInfo(hostInfo: timer.app.trend.HostInfo): string {
    if (!hostInfo) return ''
    const { host, merged } = hostInfo
    if (!host) return ''
    const mergedLabel = merged ? `[${t(msg => msg.trend.merged)}]` : ''
    return `${host}${mergedLabel}`
}
