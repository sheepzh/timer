/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { MILL_PER_DAY } from "./time"

export const MINUTES_PER_PERIOD = 15
export const PERIODS_PER_DATE = 24 * 60 / MINUTES_PER_PERIOD
export const MAX_PERIOD_ORDER = PERIODS_PER_DATE - 1
export const MILLS_PER_PERIOD = MINUTES_PER_PERIOD * 60 * 1000

export function keyOf(time: Date | number, order?: number): timer.period.Key {
    time = time instanceof Date ? time : new Date(time)
    const year = time.getFullYear()
    const month = time.getMonth() + 1
    const date = time.getDate()
    order = order === undefined
        ? time.getHours() * 4 + Math.floor(time.getMinutes() / MINUTES_PER_PERIOD)
        : order
    return { year, month, date, order }
}

export function copyKeyWith(old: timer.period.Key, newOrder: number): timer.period.Key {
    const { year, month, date } = old
    return { year, month, date, order: newOrder }
}

export function indexOf(key: timer.period.Key): number {
    const { year, month, date, order } = key
    return (year << 18)
        | (month << 14)
        | (date << 8)
        | order
}

export function compare(a: timer.period.Key, b: timer.period.Key) {
    return indexOf(a) - indexOf(b)
}

export function keyBefore(key: timer.period.Key, orderCount: number) {
    let order = key.order
    let decomposition = 0

    while (order < orderCount) {
        decomposition++
        order += PERIODS_PER_DATE
    }
    order = order - orderCount
    if (decomposition) {
        const newDate = new Date(startOfKey(key).getTime() - MILL_PER_DAY * decomposition)
        return keyOf(newDate, order)
    } else {
        return copyKeyWith(key, order)
    }
}

export function after(key: timer.period.Key, orderCount: number) {
    const date = new Date(key.year, key.month - 1, key.date, 0, (key.order + orderCount) * MINUTES_PER_PERIOD, 1)
    return keyOf(date)
}

export function startOfKey(key: timer.period.Key): Date {
    return new Date(key.year, key.month - 1, key.date, 0, MINUTES_PER_PERIOD * key.order)
}

export function lastKeyOfLastDate(key: timer.period.Key) {
    return keyBefore(key, key.order + 1)
}

export function getDateString(key: timer.period.Key) {
    return `${key.year}${key.month < 10 ? '0' : ''}${key.month}${key.date < 10 ? '0' : ''}${key.date}`
}

export function rowOf(key: timer.period.Key, duration?: number, milliseconds?: number): timer.period.Row {
    duration = duration || 1
    milliseconds = milliseconds || 0
    const date = getDateString(key)
    const endStart = startOfKey(key)
    const endTime = new Date(endStart.getTime() + MILLS_PER_PERIOD)
    const startTime = duration === 1 ? endStart : new Date(endStart.getTime() - (duration - 1) * MILLS_PER_PERIOD)
    return { startTime, endTime, milliseconds, date }
}

export function startOrderOfRow(row: timer.period.Row): number {
    return (row.startTime.getHours() * 60 + row.startTime.getMinutes()) / MINUTES_PER_PERIOD
}