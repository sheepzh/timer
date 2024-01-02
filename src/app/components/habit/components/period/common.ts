/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { PERIODS_PER_DATE, after, keyOf, rowOf, startOrderOfRow } from "@util/period"
import { MILL_PER_DAY } from "@util/time"

export function averageByDay(data: timer.period.Row[], periodSize: number): timer.period.Row[] {
    if (!data?.length) return []
    const rangeStart = data[0]?.startTime
    const rangeEnd = data[data.length - 1]?.endTime
    const dateNum = (rangeEnd.getTime() - rangeStart.getTime()) / MILL_PER_DAY
    const map: Map<number, number> = new Map()
    data.forEach(item => {
        const key = Math.floor(startOrderOfRow(item) / periodSize)
        const val = map.get(key) || 0
        map.set(key, val + item.milliseconds)
    })
    const result = []
    let period = keyOf(new Date(), 0)
    for (let i = 0; i < PERIODS_PER_DATE / periodSize; i++) {
        const key = period.order / periodSize
        const val = map.get(key) || 0
        const averageMill = Math.round(val / dateNum)
        result.push(rowOf(after(period, periodSize - 1), periodSize, averageMill))
        period = after(period, periodSize)
    }
    return result
}