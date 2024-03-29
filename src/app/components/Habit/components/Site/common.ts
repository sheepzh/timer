/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { TitleComponentOption } from "echarts/components"

import { getSecondaryTextColor } from "@util/style"
import { generateSiteLabel } from "@util/site"
import { periodFormatter } from "@app/util/time"

export const generateTitleOption = (text: string): TitleComponentOption => {
    const secondaryTextColor = getSecondaryTextColor()
    return {
        text,
        textStyle: {
            color: secondaryTextColor,
            fontSize: '14px',
            fontWeight: 'normal',
        },
        left: 'center',
        top: '2%',
    }
}

export type SeriesDataItem = {
    value: number
    row: timer.stat.Row
}

export const formatFocusTooltip = (
    params: [any] | any,
    format: timer.app.TimeFormat,
    option?: {
        splitLine?: boolean
        ignorePercentage?: boolean
    }
): string => {
    const { splitLine, ignorePercentage } = option || {}
    const param = (Array.isArray(params) ? params[0] : params) as { data: SeriesDataItem, percent: number }
    const { data, percent } = param || {}
    const { row } = data || {}
    const { host, alias, focus = 0 } = row || {}
    const siteLabel = host ? generateSiteLabel(host, alias) : (alias || 'Unknown')
    const builder: string[] = [siteLabel]
    builder.push(splitLine ? '<br/>' : ' ')
    builder.push(periodFormatter(focus, { format }))
    !ignorePercentage && builder.push(` (${(percent ?? 0).toFixed(2)}%)`)
    return builder.join('')
}

export const formatTimeTooltip = (params: [any] | any): string => {
    const param = (Array.isArray(params) ? params[0] : params) as { data: SeriesDataItem, percent: number }
    const { data, percent } = param || {}
    const { row, value } = data || {}
    const { host, alias } = row || {}
    const siteLabel = host ? generateSiteLabel(host, alias) : (alias || 'Unknown')
    return `${siteLabel}<br/>${value} (${(percent ?? 0).toFixed(2)}%)`
}

// Not show percentages less than 3 degrees
export const MIN_PERCENT_OF_PIE = 3 / 360