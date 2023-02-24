/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { log } from "../common/logger"
import { formatTime } from "@util/time"
import BaseDatabase from "./common/base-database"
import { DATE_FORMAT, REMAIN_WORD_PREFIX } from "./common/constant"
import { createZeroResult, mergeResult, isNotZeroResult } from "@util/stat"

export type TimerCondition = {
    /**
     * Date
     * {y}{m}{d} 
     */
    date?: Date | Date[]
    /**
     * Host name for query
     */
    host?: string
    /**
     * Focus range, milliseconds
     * 
     * @since 0.0.9
     */
    focusRange?: number[]
    /**
     * Time range
     * 
     * @since 0.0.9
     */
    timeRange?: number[]
    /**
     * Whether to enable full host search, default is false 
     * 
     * @since 0.0.8
     */
    fullHost?: boolean
}

type _TimerCondition = TimerCondition & {
    // Use exact date condition
    useExactDate?: boolean
    // date str
    exactDateStr?: string
    startDateStr?: string
    endDateStr?: string
    // time range
    timeStart?: number
    timeEnd?: number
    focusStart?: number
    focusEnd?: number
}

function processDateCondition(cond: _TimerCondition, paramDate: Date | Date[]) {
    if (!paramDate) return

    if (paramDate instanceof Date) {
        cond.useExactDate = true
        cond.exactDateStr = formatTime(paramDate as Date, DATE_FORMAT)
    } else {
        let startDate: Date = undefined
        let endDate: Date = undefined
        const dateArr = paramDate as Date[]
        dateArr && dateArr.length >= 2 && (endDate = dateArr[1])
        dateArr && dateArr.length >= 1 && (startDate = dateArr[0])
        cond.useExactDate = false
        startDate && (cond.startDateStr = formatTime(startDate, DATE_FORMAT))
        endDate && (cond.endDateStr = formatTime(endDate, DATE_FORMAT))
    }
}

function processParamTimeCondition(cond: _TimerCondition, paramTime: number[]) {
    if (!paramTime) return
    paramTime.length >= 2 && (cond.timeEnd = paramTime[1])
    paramTime.length >= 1 && (cond.timeStart = paramTime[0])
}

function processParamFocusCondition(cond: _TimerCondition, paramFocus: number[]) {
    if (!paramFocus) return
    paramFocus.length >= 2 && (cond.focusEnd = paramFocus[1])
    paramFocus.length >= 1 && (cond.focusStart = paramFocus[0])
}

function processCondition(condition: TimerCondition): _TimerCondition {
    const result: _TimerCondition = { ...condition }
    processDateCondition(result, condition.date)
    processParamTimeCondition(result, condition.timeRange)
    processParamFocusCondition(result, condition.focusRange)
    return result
}

function mergeMigration(exist: timer.stat.Result | undefined, another: any) {
    exist = exist || createZeroResult()
    return mergeResult(exist, { focus: another.focus || 0, time: another.time || 0 })
}

/**
 * Generate the key in local storage by host and date
 * 
 * @param host host
 * @param date date
 */
function generateKey(host: string, date: Date | string) {
    const str = typeof date === 'object' ? formatTime(date as Date, DATE_FORMAT) : date
    return str + host
}

function migrate(exists: { [key: string]: timer.stat.Result }, data: any): { [key: string]: timer.stat.Result } {
    const result = {}
    Object.entries(data)
        .filter(([key]) => /^20\d{2}[01]\d[0-3]\d.*/.test(key))
        .forEach(([key, value]) => {
            if (typeof value !== "object") return
            const exist = exists[key]
            const merged = mergeMigration(exist, value)
            merged && isNotZeroResult(merged) && (result[key] = mergeMigration(exist, value))
        })
    return result
}

class TimerDatabase extends BaseDatabase {

    async refresh(): Promise<{}> {
        const result = await this.storage.get(null)
        const items = {}
        Object.entries(result)
            .filter(([key]) =>
                !key.startsWith(REMAIN_WORD_PREFIX)
                // The prefix of archived data, historical issues
                // todo: delete this line
                && !key.startsWith('_a_')
            )
            .forEach(([key, value]) => items[key] = value)
        return Promise.resolve(items)
    }

    /**
     * @param host host
     * @since 0.1.3
     */
    async accumulate(host: string, date: Date | string, item: timer.stat.Result): Promise<timer.stat.Result> {
        const key = generateKey(host, date)
        const items = await this.storage.get(key)
        const exist: timer.stat.Result = mergeResult(items[key] as timer.stat.Result || createZeroResult(), item)
        const toUpdate = {}
        toUpdate[key] = exist
        await this.storage.set(toUpdate)
        return exist
    }

    /**
     * Batch accumulate
     * 
     * @param data data: {host=>waste_per_day}
     * @param date date
     * @since 0.1.8
     */
    async accumulateBatch(data: timer.stat.ResultSet, date: Date): Promise<timer.stat.ResultSet> {
        const hosts = Object.keys(data)
        if (!hosts.length) return
        const dateStr = formatTime(date, DATE_FORMAT)
        const keys: { [host: string]: string } = {}
        hosts.forEach(host => keys[host] = generateKey(host, dateStr))

        const items = await this.storage.get(Object.values(keys))

        const toUpdate = {}
        const afterUpdated: timer.stat.ResultSet = {}
        Object.entries(keys).forEach(([host, key]) => {
            const item = data[host]
            const exist: timer.stat.Result = mergeResult(items[key] as timer.stat.Result || createZeroResult(), item)
            toUpdate[key] = afterUpdated[host] = exist
        })
        await this.storage.set(toUpdate)
        return afterUpdated
    }

    /**
     * Select
     * 
     * @param condition     condition
     */
    async select(condition?: TimerCondition): Promise<timer.stat.Row[]> {
        log("select:{condition}", condition)
        condition = condition || {}
        const _cond: _TimerCondition = processCondition(condition)
        const items = await this.refresh()
        let result: timer.stat.Row[] = []

        for (let key in items) {
            const date = key.substring(0, 8)
            const host = key.substring(8)
            const val: timer.stat.Result = items[key]
            if (this.filterBefore(date, host, val, _cond)) {
                const { focus, time } = val
                result.push({ date, host, focus, time, mergedHosts: [] })
            }
        }

        log('Result of select: ', result)
        return result
    }

    private filterHost(host: string, condition: _TimerCondition): boolean {
        const paramHost = (condition.host || '').trim()
        if (!paramHost) return true
        if (!!condition.fullHost && host !== paramHost) return false
        if (!condition.fullHost && !host.includes(paramHost)) return false
        return true
    }

    private filterDate(date: string, condition: _TimerCondition): boolean {
        if (condition.useExactDate) {
            if (condition.exactDateStr !== date) return false
        } else {
            const { startDateStr, endDateStr } = condition
            if (startDateStr && startDateStr > date) return false
            if (endDateStr && endDateStr < date) return false
        }
        return true
    }

    private filterNumberRange(val: number, range: number[]): boolean {
        const start = range[0]
        const end = range[1]
        if (start !== null && start !== undefined && start > val) return false
        if (end !== null && end !== undefined && end < val) return false
        return true
    }

    /**
     * Filter by query parameters
     * 
     * @param date date of item
     * @param host  host of item
     * @param val  val of item
     * @param condition  query parameters
     * @return true if valid, or false  
     */
    private filterBefore(date: string, host: string, val: timer.stat.Result, condition: _TimerCondition): boolean {
        const { focus, time } = val
        const { timeStart, timeEnd, focusStart, focusEnd } = condition

        return this.filterHost(host, condition)
            && this.filterDate(date, condition)
            && this.filterNumberRange(time, [timeStart, timeEnd])
            && this.filterNumberRange(focus, [focusStart, focusEnd])
    }

    /**
     * Get by host and date
     * 
     * @since 0.0.5 
     */
    async get(host: string, date: Date): Promise<timer.stat.Result> {
        const key = generateKey(host, date)
        const items = await this.storage.get(key)
        return Promise.resolve(items[key] || createZeroResult())
    }

    /**
     * Delete the record
     * 
     * @param host host
     * @param date date
     * @since 0.0.5
     */
    async deleteByUrlAndDate(host: string, date: Date | string): Promise<void> {
        const key = generateKey(host, date)
        return this.storage.remove(key)
    }

    /**
     * Delete by key
     *  
     * @param rows     site rows, the host and date mustn't be null
     * @since 0.0.9
     */
    async delete(rows: timer.stat.Row[]): Promise<void> {
        const keys: string[] = rows.filter(({ date, host }) => !!host && !!date).map(({ host, date }) => generateKey(host, date))
        return this.storage.remove(keys)
    }

    /**
     * Force update data
     * 
     * @since 1.4.3
     */
    forceUpdate(row: timer.stat.Row): Promise<void> {
        const key = generateKey(row.host, row.date)
        const result: timer.stat.Result = { time: row.time, focus: row.focus }
        return this.storage.put(key, result)
    }

    /**
     * @param host host 
     * @param start start date, inclusive
     * @param end end date, inclusive
     * @since 0.0.7
     */
    async deleteByUrlBetween(host: string, start?: Date, end?: Date): Promise<string[]> {
        const startStr = start ? formatTime(start, DATE_FORMAT) : undefined
        const endStr = end ? formatTime(end, DATE_FORMAT) : undefined
        const dateFilter = (date: string) => (startStr ? startStr <= date : true) && (endStr ? date <= endStr : true)
        const items = await this.refresh()

        // Key format: 20201112www.google.com
        const keyReg = RegExp('\\d{8}' + host)
        const keys: string[] = Object.keys(items)
            .filter(key => keyReg.test(key) && dateFilter(key.substring(0, 8)))

        await this.storage.remove(keys)
        return Promise.resolve(keys.map(k => k.substring(0, 8)))
    }

    /**
     * Delete the record
     * 
     * @param host host
     * @since 0.0.5
     */
    deleteByUrl(host: string): Promise<string[]> {
        return this.deleteByUrlBetween(host)
    }

    /**
     * Count by condition
     * 
     * @param condition 
     * @returns count 
     * @since 1.0.2
     */
    async count(condition: TimerCondition): Promise<number> {
        condition = condition || {}
        const _cond: _TimerCondition = processCondition(condition)
        const items = await this.refresh()
        let count = 0

        for (let key in items) {
            const date = key.substring(0, 8)
            const host = key.substring(8)
            const val: timer.stat.Result = items[key]
            if (this.filterBefore(date, host, val, _cond)) {
                count++
            }
        }
        return count
    }

    async importData(data: any): Promise<void> {
        if (typeof data !== "object") return
        const items = await this.storage.get()
        const toSave = migrate(items, data)
        this.storage.set(toSave)
    }
}

export default TimerDatabase
