/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { log } from "../common/logger"
import WastePerDay, { merge, WasteData } from "@entity/dao/waste-per-day"
import DataItem from "@entity/dto/data-item"
import { formatTime } from "@util/time"
import BaseDatabase from "./common/base-database"
import { ARCHIVED_PREFIX, DATE_FORMAT, REMAIN_WORD_PREFIX } from "./common/constant"

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
     * Total range, milliseconds
     * 
     * @since 0.0.9
     */
    totalRange?: number[]
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
    totalStart?: number
    totalEnd?: number
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
function processParamTotalCondition(cond: _TimerCondition, paramTotal: number[]) {
    if (!paramTotal) return
    paramTotal.length >= 2 && (cond.totalEnd = paramTotal[1])
    paramTotal.length >= 1 && (cond.totalStart = paramTotal[0])
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
    processParamTotalCondition(result, condition.totalRange)
    processParamFocusCondition(result, condition.focusRange)
    return result
}

function mergeMigration(exist: WastePerDay | undefined, another: any) {
    exist = exist || WastePerDay.zero()
    return merge(exist, WastePerDay.of(another.total || 0, another.focus || 0, another.time || 0))
}

function migrate(exists: { [key: string]: WastePerDay }, data: any): { [key: string]: WastePerDay } {
    const result = {}
    Object.entries(data)
        .filter(([key]) => /^20\d{2}[01]\d[0-3]\d.*/.test(key))
        .forEach(([key, value]) => {
            if (typeof value !== "object") return
            const exist = exists[key]
            const merged = mergeMigration(exist, value)
            merged && merged.isNotZero() && (result[key] = mergeMigration(exist, value))
        })
    return result
}

class TimerDatabase extends BaseDatabase {

    async refresh(): Promise<{}> {
        const result = await this.storage.get(null)
        const items = {}
        Object.entries(result)
            .filter(([key]) => !key.startsWith(REMAIN_WORD_PREFIX) && !key.startsWith(ARCHIVED_PREFIX))
            .forEach(([key, value]) => items[key] = value)
        return Promise.resolve(items)
    }

    /**
     * Generate the key in local storage by host and date
     * 
     * @param host host
     * @param date date
     */
    private generateKey(host: string, date: Date | string) {
        const str = typeof date === 'object' ? formatTime(date as Date, DATE_FORMAT) : date
        return str + host
    }

    /**
     * @param host host
     * @since 0.1.3
     */
    async accumulate(host: string, date: Date, item: WastePerDay): Promise<void> {
        const key = this.generateKey(host, date)
        const items = await this.storage.get(key)
        const exist: WastePerDay = merge(items[key] as WastePerDay || new WastePerDay(), item)
        const toUpdate = {}
        toUpdate[key] = exist
        log('toUpdate', toUpdate)
        return this.storage.set(toUpdate)
    }

    /**
     * Batch accumulate
     * 
     * @param data data: {host=>waste_per_day}
     * @param date date
     * @since 0.1.8
     */
    async accumulateBatch(data: WasteData, date: Date): Promise<WasteData> {
        const hosts = Object.keys(data)
        if (!hosts.length) return
        const dateStr = formatTime(date, DATE_FORMAT)
        const keys: { [host: string]: string } = {}
        hosts.forEach(host => keys[host] = this.generateKey(host, dateStr))

        const items = await this.storage.get(Object.values(keys))

        const toUpdate = {}
        const afterUpdated: WasteData = {}
        Object.entries(keys).forEach(([host, key]) => {
            const item = data[host]
            const exist: WastePerDay = merge(items[key] as WastePerDay || new WastePerDay(), item)
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
    async select(condition?: TimerCondition): Promise<DataItem[]> {
        log("select:{condition}", condition)
        condition = condition || {}
        const _cond: _TimerCondition = processCondition(condition)
        const items = await this.refresh()
        let result: DataItem[] = []

        for (let key in items) {
            const date = key.substring(0, 8)
            const host = key.substring(8)
            const val: WastePerDay = items[key]
            if (this.filterBefore(date, host, val, _cond)) {
                const { total, focus, time } = val
                result.push({ date, host, total, focus, time, mergedHosts: [] })
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
    private filterBefore(date: string, host: string, val: WastePerDay, condition: _TimerCondition): boolean {
        const { focus, total, time } = val
        const { timeStart, timeEnd, totalStart, totalEnd, focusStart, focusEnd } = condition

        return this.filterHost(host, condition)
            && this.filterDate(date, condition)
            && this.filterNumberRange(time, [timeStart, timeEnd])
            && this.filterNumberRange(total, [totalStart, totalEnd])
            && this.filterNumberRange(focus, [focusStart, focusEnd])
    }

    /**
     * Get by host and date
     * 
     * @since 0.0.5 
     */
    async get(host: string, date: Date): Promise<WastePerDay> {
        const key = this.generateKey(host, date)
        const items = await this.storage.get(null)
        return Promise.resolve(items[key] || new WastePerDay())
    }

    /**
     * Delete the record
     * 
     * @param host host
     * @param date date
     * @since 0.0.5
     */
    async deleteByUrlAndDate(host: string, date: Date | string): Promise<void> {
        const key = this.generateKey(host, date)
        return this.storage.remove(key)
    }

    /**
     * Delete by key
     *  
     * @param rows     site rows, the host and date mustn't be null
     * @since 0.0.9
     */
    async delete(rows: DataItem[]): Promise<void> {
        const keys: string[] = rows.filter(({ date, host }) => !!host && !!date).map(({ host, date }) => this.generateKey(host, date))
        return this.storage.remove(keys)
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
            const val: WastePerDay = items[key]
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
