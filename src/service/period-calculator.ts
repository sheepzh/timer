/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import PeriodInfo, { PeriodKey } from "../entity/dto/period-info"
import PeriodResult from "../entity/dto/period-result"

/**
 * @param timestamp current ts
 * @param milliseconds milliseconds 
 * @returns results, can't be empty if milliseconds is positive
 */
export function calculate(timestamp: number, milliseconds: number): PeriodInfo[] {
    if (milliseconds <= 0) return []

    const key = PeriodKey.of(timestamp)
    const start = key.getStart().getTime()

    const currentResult = key.produce(0)
    const extraMill = timestamp - start
    const result: PeriodInfo[] = []
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
 * @param date date  
 * @param periodWindowSize divisor
 */
export function getMaxDivisiblePeriod(period: PeriodKey, periodWindowSize: number): PeriodKey {
    const maxOrder = period.order
    let order = -1
    while (order <= maxOrder) order += periodWindowSize
    order -= periodWindowSize
    if (order === -1) return period.lastOfLastDate()
    period.order = order
    return period
}

export type MergeConfig = {
    windowSize: number
    /**
     * Inclusive
     */
    start: PeriodKey
    /**
     * Inclusive
     */
    end: PeriodKey
}

export function merge(periods: PeriodInfo[], config: MergeConfig): PeriodResult[] {
    const result: PeriodResult[] = []
    let { start, end, windowSize } = config
    const map: Map<number, number> = new Map()
    periods.forEach(p => map.set(p.mapKey(), p.milliseconds))
    let millSum = 0, periodNum = 0
    for (; start.compare(end) <= 0; start = start.after(1)) {
        const mill = map.get(start.mapKey())
        mill && (millSum += mill)
        periodNum++
        if (periodNum === windowSize) {
            result.push(PeriodResult.of(start, windowSize, millSum))
            periodNum = millSum = 0
        }
    }
    return result
}