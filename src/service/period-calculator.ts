import PeriodInfo from "../entity/dto/period-info"
import { formatTime } from "../util/time"

const MILL_PER_MINUTE = 1000 * 60

function calculateDateAndMinuteOrder(currentMinute: number) {
    const minuteTs = new Date(currentMinute * MILL_PER_MINUTE)
    const date = formatTime(minuteTs, '{y}{m}{d}')
    const minuteOrder = minuteTs.getMinutes() + 60 * minuteTs.getHours()
    return { date, minuteOrder, millseconds: 0 }
}

/**
 * @param timestamp current ts
 * @param millseconds millseconds 
 * @returns results, can't be empty if millseconds is positive
 */
export function calculate(timestamp: number, millseconds: number): PeriodInfo[] {
    if (millseconds <= 0) return []

    const currentMinute = Math.floor(timestamp / MILL_PER_MINUTE)
    const currentResult = calculateDateAndMinuteOrder(currentMinute)
    const extraMill = timestamp - currentMinute * MILL_PER_MINUTE
    const result: PeriodInfo[] = []
    if (extraMill < millseconds) {
        // millseconds including before minutes
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
