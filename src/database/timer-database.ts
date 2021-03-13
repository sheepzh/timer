import { log } from "../common/logger"
import { formatTime } from "../util/time"
import { REMAIN_WORD_PREFIX } from "./constant"

/**
 * Date format for storage
 */
const DATE_FORMAT = '{y}{m}{d}'

/**
 * Time waste per day
 * 
 * @since 0.0.1
 */
export class WastePerDay {
    /**
     * Duration of visit
     */
    total: number
    /**
     * Duration of focus
     */
    focus: number
    /**
     * Visit times
     */
    time: number

    constructor() {
        this.total = 0
        this.focus = 0
        this.time = 0
    }
}

export class Row {
    host: string
    date: string
    total: number
    focus: number
    time: number
}

export class QueryParam {
    public static ASC = 1
    public static DESC = -1
    /**
     * Date 
     */
    date?: Date | Date[]
    /**
     * Host name for fuzzy query
     */
    host?: string
    /**
     * Group by the root domain
     */
    mergeDomain?: boolean
    /**
     * Merge items of the same host from different days
     */
    mergeDate?: boolean
    /**
     * The name of sorted column
     */
    sort?: string
    /**
     * 1 asc, -1 desc
     */
    sortOrder?: number
}

class PageParam {
    pageNum?: number
    pageSize?: number
}

class PageInfo {
    total: number
    list: Row[]
}

class TimeDatabase {

    private localStorage = chrome.storage.local

    public refresh(callback?: ({ }) => void) {
        this.localStorage.get(result => {
            const items = {}
            for (let key in result) {
                if (!key.startsWith(REMAIN_WORD_PREFIX)) {
                    // remain words
                    items[key] = result[key]
                }
            }
            callback && callback(items)
        })
    }

    constructor() {
        this.refresh()
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
            console.log('not use cache', toUpdate)
            this.localStorage.set(toUpdate)
        })
    }


    private increaseTime(host: string, start: number, increase: (i: WastePerDay, step: number) => void) {
        const today = new Date()
        const now = today.getTime()
        const millPerDay = 3600 * 1000 * 24
        let endOfDate = new Date(new Date(start).toLocaleDateString()).getTime() + millPerDay
        while (endOfDate < now) {
            this.updateOf(host, endOfDate - 1, (i: WastePerDay) => increase(i, endOfDate - start))
            start = endOfDate
            endOfDate += millPerDay
        }
        this.updateOf(host, now, (i: WastePerDay) => increase(i, now - start))
    }

    public addTotal(host: string, start: number) {
        log('addTotal:{host},{start}', host, new Date(start))
        this.increaseTime(host, start, (i, step) => i.total += step)
    }

    public addFocusAndTotal(host: string, focusStart: number, runStart: number) {
        log('addFocusAndTotal:{host}, {focusStart}, {runStart}', host, new Date(focusStart), new Date(runStart))
        const today = new Date()
        const now = today.getTime()
        const millPerDay = 3600 * 1000 * 24
        let endOfDate = new Date(new Date(Math.min(focusStart, runStart)).toLocaleDateString()).getTime() + millPerDay
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
            endOfDate = Math.min(endOfDate + millPerDay, now)
        }
    }

    public addOneTime(host: string) {
        this.updateOf(host, new Date(), (i: WastePerDay) => i.time += 1)
    }

    public selectByPage(callback: (page: PageInfo) => void, param?: QueryParam, page?: PageParam) {
        log("selectByPage:{param},{page}", param, page)
        page = page || { pageNum: 1, pageSize: 10 }
        this.select((origin: Row[]) => {
            let pageNum = page.pageNum
            let pageSize = page.pageSize
            pageNum === undefined || pageNum < 1 && (pageNum = 1)
            pageSize === undefined || pageSize < 1 && (pageSize = 10)

            const startIndex = (pageNum - 1) * pageSize
            const endIndex = (pageNum) * pageSize

            const total = origin.length
            const list: Row[] = startIndex >= total ? [] : origin.slice(startIndex, Math.min(endIndex, total))
            callback({ total, list })
        }, param)

    }

    public select(callback: (result: Row[]) => void, param?: QueryParam) {
        log("selectByPage:{param}", param)
        param = param || new QueryParam()
        this.refresh(items => {
            let result: Row[] = []
            // 1st filter
            for (let key in items) {
                const date = key.substr(0, 8)
                const host = key.substring(8)
                const val: WastePerDay = items[key]
                if (this.filterBefore(date, host, val, param)) {
                    const { total, focus, time } = val
                    result.push({ date, host, total, focus, time })
                }
            }
            // 2nd merge
            param.mergeDomain && (result = this.mergeDomain(result))
            // filter again, cause of the exchange of the host, if the param.mergeDomain is true
            param.mergeDomain && (result = this.filterAfter(result, param))
            param.mergeDate && (result = this.mergeDate(result))
            // 3st sort
            const sort = param.sort
            if (sort) {
                const order = param.sortOrder || QueryParam.DESC
                result.sort((a, b) => {
                    const aa = a[sort]
                    const bb = b[sort]
                    if (aa === bb) return 0
                    return order * (aa > bb ? 1 : -1)
                })
            }
            // 4th page
            return callback(result)
        })
    }

    /**
     * Filter by query parameters
     * 
     * @param date date of item
     * @param host  host of item
     * @param val  val of item
     * @param param  query parameters
     * @return true if valid, or false  
     */
    private filterBefore(date: string, host: string, val: WastePerDay, param: QueryParam) {
        const paramDate = param.date
        const paramHost = (param.host || '').trim()
        if (paramDate !== undefined) {
            if (paramHost && !host.includes(paramHost)) return false

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

        return true
    }

    private filterAfter(origin: Row[], param: QueryParam) {
        const paramHost = (param.host || '').trim()
        return paramHost ? origin.filter(o => o.host.includes(paramHost)) : origin
    }

    private mergeDomain(origin: Row[]): Row[] {
        const newRows = []
        const map = {}
        const ipAndPort = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])(:\d{0,5})?$/

        origin.forEach(o => {
            const host = o.host
            const date = o.date
            let domain = host
            if (!ipAndPort.test(domain)) {
                // not domain
                let dotIndex = host.lastIndexOf('.')
                if (dotIndex !== -1) {
                    const pre = host.substring(0, dotIndex)
                    dotIndex = pre.lastIndexOf('.')
                    if (dotIndex !== -1) {
                        domain = host.substring(dotIndex + 1)
                    }
                }
            }

            this.merge(map, o, domain + date).host = domain
        })
        for (let key in map) {
            newRows.push(map[key])
        }
        return newRows
    }

    private mergeDate(origin: Row[]): Row[] {
        const newRows = []
        const map = {}

        origin.forEach(o => this.merge(map, o, o.host).date = undefined)
        for (let key in map) {
            newRows.push(map[key])
        }
        return newRows
    }

    private merge(map: {}, origin: Row, key: string): Row {
        let exist: Row = map[key]
        if (exist === undefined) {
            exist = map[key] = origin
        } else {
            exist.time += origin.time
            exist.focus += origin.focus
            exist.total += origin.total
        }
        return exist
    }

    /**
     * Get by host and date
     * 
     * @since 0.0.5 
     */
    public get(host: string, date: Date | string, callback: (info: WastePerDay) => void) {
        const key = this.generateKey(host, date)
        this.localStorage.get(items => callback(items[key] || new WastePerDay()))
    }

    /**
     * Delete the record
     * 
     * @param host host
     * @param date date
     * @param callback callback
     * @since 0.0.5
     */
    public deleteByUrlAndDate(host: string, date: string, callback?: () => void) {
        const key = this.generateKey(host, date)
        this.localStorage.remove(key, () => callback && callback())
    }

    /**
     * Delete the record
     * 
     * @param host host
     * @param callback callback
     * @since 0.0.5
     */
    public deleteByUrl(host: string, callback?: (date: string[]) => void) {
        this.refresh(items => {
            const keys = []
            for (const key in items) {
                // Key format: 20201112www.google.com
                if (key.length === 8 + host.length && key.substring(8) === host) {
                    keys.push(key)
                }
            }
            this.localStorage.remove(keys, () => callback && callback(keys.map(k => k.substring(0, 8))))
        })
    }
}

export default new TimeDatabase()
