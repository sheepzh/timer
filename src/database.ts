import { uniqueSort } from "jquery"
import { formatTime } from "./util/time"

/**
 * Date format for storage
 */
const DATE_FORMAT = '{y}{m}{d}'

/**
 * Time waste per day
 * 
 * @since 1.0.0
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

class Database {

    private items = {}

    private localStorage = chrome.storage.local

    public refresh(callback?: Function) {
        this.localStorage.get(result => {
            this.items = {}
            for (let key in result) {
                if (key !== 'config' && key !== 'blacklist') {
                    // remain words
                    this.items[key] = result[key]
                }
            }
            callback && callback(this.items)
        })
    }

    constructor() {
        this.refresh()
    }

    private resolveTodayOf(host: string, resolver: (w: WastePerDay) => void) {
        const key = formatTime(new Date(), DATE_FORMAT) + host
        const todayInfo = this.items[key] || new WastePerDay()
        resolver(todayInfo)
        this.items[key] = todayInfo

        const toUpdate = {}
        toUpdate[key] = todayInfo

        // May cause error: Extension context invalidated.
        try {
            this.localStorage.set(toUpdate)
        } catch {
            // Ignore
        }
    }

    public addTotal(host: string, total: number) {
        this.resolveTodayOf(host, (i: WastePerDay) => i.total += total)
    }

    public addFocus(host: string, focus: number) {
        this.resolveTodayOf(host, (i: WastePerDay) => i.focus += focus)
    }

    public addOneTime(host: string) {
        this.resolveTodayOf(host, (i: WastePerDay) => i.time += 1)
    }

    public selectByPage(param?: QueryParam, page?: PageParam): PageInfo {
        const origin: Row[] = this.select(param)
        let pageNum = page.pageNum
        let pageSize = page.pageSize
        pageNum === undefined || pageNum < 1 && (pageNum = 1)
        pageSize === undefined || pageSize < 1 && (pageSize = 10)

        const startIndex = (pageNum - 1) * pageSize
        const endIndex = (pageNum) * pageSize

        const total = origin.length
        const list = startIndex >= total ? [] : origin.slice(startIndex, Math.min(endIndex, total))
        return { total, list }
    }

    public select(param?: QueryParam): Row[] {
        param = param || new QueryParam()
        let result: Row[] = []
        // 1st filter
        for (let key in this.items) {
            const date = key.substr(0, 8)
            const host = key.substring(8)
            const val: WastePerDay = this.items[key]
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
        return result
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
                if (!!param.date && formatTime(paramDate as Date, DATE_FORMAT) !== date) {
                    return false
                }
            } else {
                let startDate: Date = undefined
                let endDate: Date = undefined
                const dateArr = paramDate as Date[]
                dateArr.length >= 2 && (endDate = dateArr[1])
                dateArr.length >= 1 && (startDate = dateArr[0])
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

            this.merge(map, o, domain).host = domain
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

    private merge(map: {}, origin: Row, host: string): Row {
        let exist: Row = map[host]
        if (exist === undefined) {
            exist = map[host] = origin
        } else {
            exist.time += origin.time
            exist.focus += origin.focus
            exist.total += origin.total
        }
        return exist
    }

    public getTodayOf(host: string) {
        return this.items[formatTime(new Date(), DATE_FORMAT) + host] || new WastePerDay()
    }
}

export default new Database()
