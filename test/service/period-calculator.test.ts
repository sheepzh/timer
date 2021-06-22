import PeriodInfo from "../../src/entity/dto/period-info"
import { calculate } from "../../src/service/period-calculator"
import { formatTime, MILL_PER_DAY } from "../../src/util/time"

function timestampOf(base: Date, hour: number, minute: number, second: number, mill: number) {
    const date = new Date(base)
    date.setHours(hour)
    date.setMinutes(minute)
    date.setSeconds(second)
    date.setMilliseconds(mill)
    return date.getTime()
}

/**
 * Cross one minute or not
 */
test('', () => {
    const base = new Date()
    const dateStr = formatTime(base, '{y}{m}{d}')
    // 13:22:56 876
    const ts1 = timestampOf(base, 13, 22, 56, 876)
    let result = calculate(ts1, 877)
    expect(result.length).toEqual(1)
    let current = result[0]
    let realCurrent: PeriodInfo = { date: dateStr, millseconds: 877, minuteOrder: 22 + 13 * 60 }
    expect(current).toEqual(realCurrent)

    result = calculate(ts1, 56 * 1000 + 877)
    expect(result.length).toEqual(2)
    const last = result[0]
    const realLast: PeriodInfo = { date: dateStr, millseconds: 1, minuteOrder: 22 + 13 * 60 - 1 }
    expect(last).toEqual(realLast)
    current = result[1]
    realCurrent.millseconds = 56 * 1000 + 876
    expect(current).toEqual(realCurrent)
})

/**
 * Cross one day 
 */
test('', () => {
    const base = new Date()
    const dateStr = formatTime(base, '{y}{m}{d}')

    // 00:00:02 876
    const ts1 = timestampOf(base, 0, 0, 2, 876)
    const yesterdayStr = formatTime(ts1 - MILL_PER_DAY, '{y}{m}{d}')

    let result = calculate(ts1, 3000)

    expect(result.length).toEqual(2)
    const last = result[0]
    const realLast: PeriodInfo = { date: yesterdayStr, millseconds: 3000 - 2876, minuteOrder: 1439 }
    expect(last).toEqual(realLast)
    const current = result[1]
    const realCurrent: PeriodInfo = { date: dateStr, minuteOrder: 0, millseconds: 2876 }
    expect(current).toEqual(realCurrent)
})