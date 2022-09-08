/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { keyOf, startOfKey, lastKeyOfLastDate, indexOf, after, compare, rowOf } from "@util/period"

/**
 * @param timestamp current ts
 * @param milliseconds milliseconds 
 * @returns results, can't be empty if milliseconds is positive
 */
export function calculate(timestamp: number, milliseconds: number): timer.period.Result[] {
    if (milliseconds <= 0) return []

    const key = keyOf(timestamp)
    const start = startOfKey(key)?.getTime()

    const currentResult = { ...key, milliseconds: 0 }
    const extraMill = timestamp - start
    const result: timer.period.Result[] = []
    if (extraMill < milliseconds) {
        // milliseconds including before period
        // 1st. add before ones
        const before = calculate(timestamp - extraMill - 1, milliseconds - extraMill)
        result.push(...before)
        // 2nd. shorten milliseconds
        currentResult.milliseconds = extraMill
    } else {
        // All is in current minute
        currentResult.milliseconds = milliseconds
    }
    result.push(currentResult)
    return result
}

/**
 * Found the max divisible period
 * 
 * @param period key
 * @param periodWindowSize divisor
 */
export function getMaxDivisiblePeriod(period: timer.period.Key, periodWindowSize: number): timer.period.Key {
    const maxOrder = period.order
    let order = -1
    while (order <= maxOrder) order += periodWindowSize
    order -= periodWindowSize
    if (order === -1) return lastKeyOfLastDate(period)
    period.order = order
    return period
}

export type MergeConfig = {
    windowSize: number
    /**
     * Inclusive
     */
    start: timer.period.Key
    /**
     * Inclusive
     */
    end: timer.period.Key
}

export function merge(periods: timer.period.Result[], config: MergeConfig): timer.period.Row[] {
    const result: timer.period.Row[] = []
    let { start, end, windowSize } = config
    const map: Map<number, number> = new Map()
    periods.forEach(p => map.set(indexOf(p), p.milliseconds))
    let millSum = 0, periodNum = 0
    for (; compare(start, end) <= 0; start = after(start, 1)) {
        const mill = map.get(indexOf(start))
        mill && (millSum += mill)
        periodNum++
        if (periodNum === windowSize) {
            result.push(rowOf(start, windowSize, millSum))
            periodNum = millSum = 0
        }
    }
    return result
}