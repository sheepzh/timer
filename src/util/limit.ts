import { getWeekDay, MILL_PER_MINUTE, MILL_PER_SECOND } from "./time"

export const DELAY_MILL = 5 * MILL_PER_MINUTE

export function matches(cond: timer.limit.Item['cond'], url: string): boolean {
    return cond?.some?.(
        c => new RegExp(`^${(c || '').split('*').join('.*')}`).test(url)
    )
}

export const meetLimit = (limit: number, value: number) => !!limit && !!value && value > limit

export const meetTimeLimit = (limitSec: number, wastedMill: number, allowDelay: boolean, delayCount: number) => {
    let realLimit = (limitSec ?? 0) * MILL_PER_SECOND
    allowDelay && realLimit && (realLimit += DELAY_MILL * (delayCount ?? 0))
    return meetLimit(realLimit, wastedMill)
}

type TimeLimitState = 'NORMAL' | 'REMINDER' | 'LIMITED'

type LimitStateResult = {
    daily: TimeLimitState
    weekly: TimeLimitState
}

export function calcTimeState(item: timer.limit.Item, reminderMills: number): LimitStateResult {
    let res: LimitStateResult = {
        daily: "NORMAL",
        weekly: "NORMAL",
    }
    const {
        time, waste = 0, delayCount = 0,
        weekly, weeklyWaste = 0, weeklyDelayCount = 0,
        allowDelay,
    } = item || {}
    // 1. daily states
    if (meetTimeLimit(time, waste, allowDelay, delayCount)) {
        res.daily = 'LIMITED'
    } else if (reminderMills && meetTimeLimit(time, waste + reminderMills, allowDelay, delayCount)) {
        res.daily = 'REMINDER'
    }

    // 2. weekly states
    if (meetTimeLimit(weekly, weeklyWaste, allowDelay, weeklyDelayCount)) {
        res.weekly = 'LIMITED'
    } else if (reminderMills && meetTimeLimit(weekly, weeklyWaste + reminderMills, allowDelay, weeklyDelayCount)) {
        res.weekly = 'REMINDER'
    }

    return res
}

export function hasLimited(item: timer.limit.Item): boolean {
    return hasDailyLimited(item) || hasWeeklyLimited(item)
}

export function hasDailyLimited(item: timer.limit.Item): boolean {
    const { time, count, waste = 0, visit = 0, delayCount = 0, allowDelay } = item || {}
    const timeMeet = meetTimeLimit(time, waste, allowDelay, delayCount)
    const countMeet = meetLimit(count, visit)
    return timeMeet || countMeet
}

export function hasWeeklyLimited(item: timer.limit.Item): boolean {
    const { weekly, weeklyCount, weeklyWaste = 0, weeklyVisit = 0, weeklyDelayCount = 0, allowDelay } = item || {}
    const timeMeet = meetTimeLimit(weekly, weeklyWaste, allowDelay, weeklyDelayCount)
    const countMeet = meetLimit(weeklyCount, weeklyVisit)
    return timeMeet || countMeet
}

export function isEnabledAndEffective(rule: timer.limit.Rule): boolean {
    return rule?.enabled && isEffective(rule)
}

export function isEffective(rule: timer.limit.Rule): boolean {
    if (!rule) return false
    const { weekdays } = rule

    const weekdayLen = weekdays?.length
    if (!weekdayLen || weekdayLen <= 0 || weekdayLen >= 7) {
        return true
    }
    const weekday = getWeekDay(new Date())
    return weekdays.includes(weekday)
}

const idx2Str = (time: number): string => {
    time = time ?? 0
    const hour = Math.floor(time / 60)
    const min = time - hour * 60
    const hourStr = (hour < 10 ? "0" : "") + hour
    const minStr = (min < 10 ? "0" : "") + min
    return `${hourStr}:${minStr}`
}

export const date2Idx = (date: Date): number => date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds()

export const dateMinute2Idx = (date: Date): number => {
    const hour = date.getHours()
    const min = date.getMinutes()
    return hour * 60 + min
}

export const period2Str = (p: timer.limit.Period): string => {
    const start = p?.[0]
    const end = p?.[1]
    return `${idx2Str(start)}-${idx2Str(end)}`
}
