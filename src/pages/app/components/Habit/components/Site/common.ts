/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { TitleComponentOption } from "echarts/components"

import { getRegularTextColor } from "@util/style"
import { formatTimeYMD, getDayLength, isSameDay } from "@util/time"

export const generateTitleOption = (text: string): TitleComponentOption => {
    const secondaryTextColor = getRegularTextColor()
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

/**
 * @param dateRange date range of filter
 * @returns [averageLen, exclusiveToday4Average, exclusiveDate]
 */
export const computeAverageLen = (dateRange: [Date, Date] = [null, null]): [number, boolean, string] => {
    const [start, end] = dateRange
    if (!end) return [0, false, null]
    if (isSameDay(start, end)) return [1, false, null]
    const dateDiff = getDayLength(start, end)
    const endIsTody = isSameDay(end, new Date())
    if (endIsTody) {
        return [dateDiff - 1, true, formatTimeYMD(end)]
    } else {
        return [dateDiff, false, null]
    }
}