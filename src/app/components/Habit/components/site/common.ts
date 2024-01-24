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

export const formatFocusTooltip = (params: [any] | any, timeFormat: timer.app.TimeFormat, splitLine?: boolean): string => {
    const param = (Array.isArray(params) ? params[0] : params) as { data: SeriesDataItem }
    const { data } = param || {}
    const { row } = data || {}
    const { host, alias, focus = 0 } = row || {}
    const siteLabel = host ? generateSiteLabel(host, alias) : (alias || 'Unknown')
    return `${siteLabel}${splitLine ? '<br/>' : ' '}${periodFormatter(focus, timeFormat)}`
}

export const formatTimeTooltip = (params: [any] | any): string => {
    const param = (Array.isArray(params) ? params[0] : params) as { data: SeriesDataItem }
    const { data } = param || {}
    const { row, value } = data || {}
    const { host, alias } = row || {}
    const siteLabel = host ? generateSiteLabel(host, alias) : (alias || 'Unknown')
    return `${siteLabel}<br/>${value}`
}

// Not show percentages less than 3 degrees
export const MIN_PERCENT_OF_PIE = 3 / 360