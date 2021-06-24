import PeriodInfo, { PeriodKey } from "../entity/dto/period-info"
import PeriodResult from "../entity/dto/period-result"

/**
 * @param timestamp current ts
 * @param millseconds millseconds 
 * @returns results, can't be empty if millseconds is positive
 */
export function calculate(timestamp: number, millseconds: number): PeriodInfo[] {
    if (millseconds <= 0) return []

    const key = PeriodKey.of(timestamp)
    const start = key.getStart().getTime()

    const currentResult = key.produce(0)
    const extraMill = timestamp - start
    const result: PeriodInfo[] = []
    if (extraMill < millseconds) {
        // millseconds including before period
        // 1st. add before ones
        const before = calculate(timestamp - extraMill - 1, millseconds - extraMill)
        result.push(...before)
        // 2nd. shorten millseconds
        currentResult.millseconds = extraMill
    } else {
        // All is in current minute
        currentResult.millseconds = millseconds
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
    periods.forEach(p => map.set(p.mapKey(), p.millseconds))
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