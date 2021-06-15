import chrome from "../../test/__mock__"
import { log } from "../common/logger"
import WastePerDay, { merge } from "../entity/dao/waste-per-day"
import SiteInfo from "../entity/dto/site-info"
import { formatTime } from "../util/time"
import { ARCHIVED_PREFIX, DATE_FORMAT, REMAIN_WORD_PREFIX } from "./constant"

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
     * Total range, millseconds
     * 
     * @since 0.0.9
     */
    totalRange?: number[]
    /**
     * Focus range, millseconds
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

function processCondition(condition: TimerCondition): _TimerCondition {
    const result: _TimerCondition = { ...condition }
    const paramDate = condition.date
    if (paramDate) {
        if (paramDate instanceof Date) {
            result.useExactDate = true
            result.exactDateStr = formatTime(paramDate as Date, DATE_FORMAT)
        } else {
            let startDate: Date = undefined
            let endDate: Date = undefined
            const dateArr = paramDate as Date[]
            dateArr && dateArr.length >= 2 && (endDate = dateArr[1])
            dateArr && dateArr.length >= 1 && (startDate = dateArr[0])
            result.useExactDate = false
            startDate && (result.startDateStr = formatTime(startDate, DATE_FORMAT))
            endDate && (result.endDateStr = formatTime(endDate, DATE_FORMAT))
        }
    }
    const paramTime = condition.timeRange
    if (paramTime) {
        paramTime.length >= 2 && (result.timeEnd = paramTime[1])
        paramTime.length >= 1 && (result.timeStart = paramTime[0])
    }
    const paramTotal = condition.totalRange
    if (paramTotal) {
        paramTotal.length >= 2 && (result.totalEnd = paramTotal[1])
        paramTotal.length >= 0 && (result.totalStart = paramTotal[0])
    }
    const paramFocus = condition.focusRange
    if (paramFocus) {
        paramFocus.length >= 2 && (result.focusEnd = paramFocus[1])
        paramFocus.length >= 1 && (result.focusStart = paramFocus[0])
    }
    return result
}

class TimeDatabase {

    private localStorage: chrome.storage.StorageArea = chrome.storage.local

    refresh(): Promise<{}> {
        return new Promise(resolve => {
            this.localStorage.get(result => {
                const items = Object.entries(result)
                    .filter(([key]) => !key.startsWith(REMAIN_WORD_PREFIX) && !key.startsWith(ARCHIVED_PREFIX))
                    .reduce((result, [key, value]) => {
                        result[key] = value
                        return result
                    }, {})
                resolve(items)
            })
        })
    }

    /**
     * Generate the key in localstorage by host and date
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
    accumulate(host: string, date: Date, item: WastePerDay): Promise<void> {
        const key = this.generateKey(host, date)
        return new Promise(resolve => {
            this.localStorage.get(key, items => {
                const exist: WastePerDay = merge(items[key] as WastePerDay || new WastePerDay(), item)
                const toUpdate = {}
                toUpdate[key] = exist
                log('toUpdate', toUpdate)
                this.localStorage.set(toUpdate, resolve)
            })
        })
    }

    /**
     * Batch accumulate
     * 
     * @param data data: {host=>waste_per_day}
     * @param date date
     * @since 0.1.8
     */
    accumulateBatch(data: { [host: string]: WastePerDay }, date: Date): Promise<void> {
        const hosts = Object.keys(data)
        if (!hosts.length) return
        const dateStr = formatTime(date, DATE_FORMAT)
        const keys: { [host: string]: string } = {}
        hosts.forEach(host => keys[host] = this.generateKey(host, dateStr))

        return new Promise(resolve => {
            this.localStorage.get(Object.values(keys), items => {
                const toUpdate = {}
                Object.entries(keys).forEach(([host, key]) => {
                    const item = data[host]
                    const exist: WastePerDay = merge(items[key] as WastePerDay || new WastePerDay(), item)
                    toUpdate[key] = exist
                })
                log('batchToUpdate', toUpdate)
                Object.keys(toUpdate).length && this.localStorage.set(toUpdate, resolve)
            })
        })
    }

    /**
     * Select
     * 
     * @param condition     condition
     */
    async select(condition?: TimerCondition): Promise<SiteInfo[]> {
        log("select:{condition}", condition)
        condition = condition || {}
        const _cond: _TimerCondition = processCondition(condition)
        const items = await this.refresh()
        let result: SiteInfo[] = []

        for (let key in items) {
            const date = key.substr(0, 8)
            const host = key.substring(8)
            const val: WastePerDay = items[key]
            if (this.filterBefore(date, host, val, _cond)) {
                const { total, focus, time } = val
                result.push({ date, host, total, focus, time, mergedHosts: [] })
            }
        }

        log('Result of select: ', result)
        return Promise.resolve(result)
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
    private filterBefore(date: string, host: string, val: WastePerDay, condition: _TimerCondition) {
        const paramHost = (condition.host || '').trim()
        // Host
        if (paramHost) {
            if (!!condition.fullHost && host !== paramHost) return false
            if (!condition.fullHost && !host.includes(paramHost)) return false
        }
        // Date
        if (condition.useExactDate) {
            if (condition.exactDateStr !== date) return false
        } else {
            const { startDateStr, endDateStr } = condition
            if (startDateStr && startDateStr > date) return false
            if (endDateStr && endDateStr < date) return false
        }
        // Item range 
        const { focus, total, time } = val
        const { timeStart, timeEnd, totalStart, totalEnd, focusStart, focusEnd } = condition
        if (timeStart !== null && timeStart !== undefined && timeStart > time) return false
        if (timeEnd !== null && timeEnd !== undefined && timeEnd < time) return false
        if (totalStart !== null && totalStart !== undefined && totalStart > total) return false
        if (totalEnd !== null && totalEnd !== undefined && totalEnd < total) return false
        if (focusStart !== null && focusStart !== undefined && focusStart > focus) return false
        if (focusEnd !== null && focusEnd !== undefined && focusEnd < focus) return false

        return true
    }

    /**
     * Get by host and date
     * 
     * @since 0.0.5 
     */
    get(host: string, date: Date): Promise<WastePerDay> {
        const key = this.generateKey(host, date)
        return new Promise(resolve => this.localStorage.get(items => resolve(items[key] || new WastePerDay())))
    }

    /**
     * Delete the record
     * 
     * @param host host
     * @param date date
     * @since 0.0.5
     */
    deleteByUrlAndDate(host: string, date: Date | string): Promise<void> {
        const key = this.generateKey(host, date)
        return new Promise(resolve => this.localStorage.remove(key, resolve))
    }

    /**
     * Delete by key
     *  
     * @param rows     site rows, the host and date mustn't be null
     * @since 0.0.9
     */
    async delete(rows: SiteInfo[]): Promise<void> {
        const keys = rows.filter(({ date, host }) => !!host && !!date).map(({ host, date }) => this.generateKey(host, date))

        const promises: Promise<void>[] = keys
            .map(key =>
                new Promise<void>(resolve => this.localStorage.remove(key, resolve))
            )
        await Promise.all(promises)
        return Promise.resolve()
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
        const keys: string[] = []
        for (const key in items) {
            // Key format: 20201112www.google.com
            key.length === 8 + host.length
                && key.substring(8) === host
                && dateFilter(key.substring(0, 8))
                && keys.push(key)
        }
        return new Promise(resolve => this.localStorage.remove(keys, () => resolve(keys.map(k => k.substring(0, 8)))))
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
}

export default new TimeDatabase()