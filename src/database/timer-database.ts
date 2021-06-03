import { log } from "../common/logger"
import WastePerDay from "../entity/dao/waste-per-day"
import SiteInfo from "../entity/dto/site-info"
import { formatTime, MILL_PER_DAY } from "../util/time"
import { ARCHIVED_PREFIX, REMAIN_WORD_PREFIX } from "./constant"

/**
 * Date format for storage
 */
export const DATE_FORMAT = '{y}{m}{d}'

export type TimerCondition = {
    /**
     * Date 
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

class TimeDatabase {

    private localStorage = chrome.storage.local

    refresh(): Promise<{}> {
        return new Promise(resolve => {
            this.localStorage.get(result => {
                const items = {}
                for (let key in result) {
                    if (!key.startsWith(REMAIN_WORD_PREFIX) && !key.startsWith(ARCHIVED_PREFIX)) {
                        items[key] = result[key]
                    }
                }
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
    private generateKey(host: string, date: string | Date | number) {
        if (typeof date === 'string') {
            return date + host
        } else {
            return formatTime(date, DATE_FORMAT) + host
        }
    }

    private updateOf(host: string, date: Date | number, updater: (w: WastePerDay) => void) {
        const key = this.generateKey(host, date)
        this.localStorage.get(items => {
            // Double sync
            let info = items[key] || new WastePerDay()
            updater(info)
            const toUpdate = {}
            toUpdate[key] = info
            this.localStorage.set(toUpdate)
        })
    }

    private increaseTime(host: string, start: number, increase: (i: WastePerDay, step: number) => void) {
        const today = new Date()
        const now = today.getTime()
        let endOfDate = new Date(new Date(start).toLocaleDateString()).getTime() + MILL_PER_DAY
        while (endOfDate < now) {
            this.updateOf(host, endOfDate - 1, (i: WastePerDay) => increase(i, endOfDate - start))
            start = endOfDate
            endOfDate += MILL_PER_DAY
        }
        this.updateOf(host, now, (i: WastePerDay) => increase(i, now - start))
    }

    addTotal(host: string, start: number) {
        log('addTotal:{host},{start}', host, new Date(start))
        this.increaseTime(host, start, (i, step) => i.total += step)
    }

    addFocusAndTotal(host: string, focusStart: number, runStart: number) {
        const today = new Date()
        log('addFocusAndTotal:{host}, {focusStart}, {runStart}, {now}', host, new Date(focusStart), new Date(runStart), today)
        const now = today.getTime()
        let endOfDate = new Date(new Date(Math.min(focusStart, runStart)).toLocaleDateString()).getTime() + MILL_PER_DAY
        while (true) {
            const hasFocus = endOfDate > focusStart
            const focusPeriod = endOfDate - focusStart
            const hasRun = endOfDate > runStart
            const runPeriod = endOfDate - runStart
            const currentDate = endOfDate === now ? now : endOfDate - 1
            this.updateOf(host, currentDate, (i: WastePerDay) => {
                hasFocus && (i.focus += focusPeriod)
                hasRun && (i.total += runPeriod)
            })
            if (currentDate === now) {
                break
            }
            endOfDate = Math.min(endOfDate + MILL_PER_DAY, now)
        }
    }

    addOneTime(host: string) {
        log('addTime:{host}', host)
        this.updateOf(host, new Date(), (i: WastePerDay) => i.time += 1)
    }

    /**
     * Select
     * 
     * @param condition     condition
     */
    async select(condition?: TimerCondition): Promise<SiteInfo[]> {
        log("select:{condition}", condition)
        condition = condition || {}
        const items = await this.refresh()
        let result: SiteInfo[] = []

        for (let key in items) {
            const date = key.substr(0, 8)
            const host = key.substring(8)
            const val: WastePerDay = items[key]
            if (this.filterBefore(date, host, val, condition)) {
                const { total, focus, time } = val
                result.push({ date, host, total, focus, time })
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
    private filterBefore(date: string, host: string, val: WastePerDay, condition: TimerCondition) {
        const paramDate = condition.date
        const paramHost = (condition.host || '').trim()
        const paramTimeRange = condition.timeRange
        const paramTotalRange = condition.totalRange
        const paramFocusRange = condition.focusRange

        if (paramHost) {
            if (!!condition.fullHost && host !== paramHost) {
                return false
            }
            if (!condition.fullHost && !host.includes(paramHost)) {
                return false
            }
        }

        if (paramDate !== undefined) {
            if (paramDate instanceof Date) {
                const paramDateStr = formatTime(paramDate as Date, DATE_FORMAT)
                if (paramDateStr !== date) {
                    return false
                }
            } else {
                let startDate: Date = undefined
                let endDate: Date = undefined
                const dateArr = paramDate as Date[]
                dateArr && dateArr.length >= 2 && (endDate = dateArr[1])
                dateArr && dateArr.length >= 1 && (startDate = dateArr[0])
                if (startDate && formatTime(startDate, DATE_FORMAT) > date) {
                    return false
                }
                if (endDate && formatTime(endDate, DATE_FORMAT) < date) {
                    return false
                }
            }
        }

        const { focus, total, time } = val

        if (paramTimeRange instanceof Array) {
            if (paramTimeRange.length === 2) {
                const timeStart = paramTimeRange[0]
                const timeEnd = paramTimeRange[1]
                if (timeStart !== null && timeStart !== undefined && timeStart > time) {
                    return false
                }
                if (timeEnd !== null && timeEnd !== undefined && timeEnd < time) {
                    return false
                }
            }
        }

        if (paramTotalRange instanceof Array) {
            if (paramTotalRange.length === 2) {
                const totalStart = paramTotalRange[0]
                const totalEnd = paramTotalRange[1]
                if (totalStart !== null && totalStart !== undefined && totalStart > total) {
                    return false
                }
                if (totalEnd !== null && totalEnd !== undefined && totalEnd < total) {
                    return false
                }
            }
        }

        if (paramFocusRange instanceof Array) {
            if (paramFocusRange.length === 2) {
                const focusStart = paramFocusRange[0]
                const focusEnd = paramFocusRange[1]
                if (focusStart !== null && focusStart !== undefined && focusStart > focus) {
                    return false
                }
                if (focusEnd !== null && focusEnd !== undefined && focusEnd < focus) {
                    return false
                }
            }
        }

        return true
    }

    /**
     * Get by host and date
     * 
     * @since 0.0.5 
     */
    get(host: string, date: Date | string): Promise<WastePerDay> {
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
    deleteByUrlAndDate(host: string, date: string): Promise<void> {
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
    async deleteByUrlBetween(host: string, start?: string, end?: string): Promise<string[]> {
        const dateFilter = (date: string) => (start ? start <= date : true) && (end ? date <= end : true)
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