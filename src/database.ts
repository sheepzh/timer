import { formatTime } from "./util/time"

/**
 * Date format for storage
 */
const DATE_FORMAT = '{y}{m}{d}'

let OPEN_LOG = false

function log(...args: any) {
    OPEN_LOG && console.log(args)
}

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

    private resolveOf(host: string, date: Date | number, resolver: (w: WastePerDay) => void) {
        const key = formatTime(date, DATE_FORMAT) + host
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


    public increaseTime(host: string, start: number, increase: (i: WastePerDay, step: number) => void) {
        const today = new Date()
        const now = today.getTime()
        const millPerDay = 3600 * 1000 * 24
        let endOfDate = new Date(new Date(start).toLocaleDateString()).getTime() + millPerDay
        while (endOfDate < now) {
            this.resolveOf(host, endOfDate - 1, (i: WastePerDay) => increase(i, endOfDate - start))
            start = endOfDate
            endOfDate += millPerDay
        }
        this.resolveOf(host, now, (i: WastePerDay) => increase(i, now - start))
    }

    public addTotal(host: string, start: number) {
        log('addTotal:{host},{start}', host, new Date(start))
        this.increaseTime(host, start, (i, step) => i.total += step)
    }

    public addFocus(host: string, start: number) {
        log('addFocus:{host},{start}', host, new Date(start))
        this.increaseTime(host, start, (i, step) => i.focus += step)
    }


    public addOneTime(host: string) {
        this.resolveOf(host, new Date(), (i: WastePerDay) => i.time += 1)
    }

    public selectByPage(param?: QueryParam, page?: PageParam): PageInfo {
        log("selectByPage:{param},{page}", param, page)
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
        log("selectByPage:{param}", param)
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
                const paramDateStr = formatTime(paramDate as Date, DATE_FORMAT)
                if (paramDateStr !== date) {
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

    public getTodayOf(host: string) {
        return this.items[formatTime(new Date(), DATE_FORMAT) + host] || new WastePerDay()
    }
}

export default new Database()

export function openLog() {
    OPEN_LOG = true
}