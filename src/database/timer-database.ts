import { log } from "../common/logger"
import WastePerDay from "../entity/dao/waste-per-day"
import SiteInfo from "../entity/dto/site-info"
import { formatTime, MILL_PER_DAY } from "../util/time"
import { ARCHIVED_PREFIX, REMAIN_WORD_PREFIX } from "./constant"

/**
 * Date format for storage
 */
export const DATE_FORMAT = '{y}{m}{d}'

export class QueryParam {
    public static ASC = 1
    public static DESC = -1
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

declare class PageParam {
    pageNum?: number
    pageSize?: number
}

class PageInfo {
    total: number
    list: SiteInfo[]
}

class TimeDatabase {

    private localStorage = chrome.storage.local

    public refresh(callback?: ({ }) => void) {
        this.localStorage.get(result => {
            const items = {}
            for (let key in result) {
                if (!key.startsWith(REMAIN_WORD_PREFIX) && !key.startsWith(ARCHIVED_PREFIX)) {
                    // remain words
                    items[key] = result[key]
                }
            }
            callback && callback(items)
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

    public addTotal(host: string, start: number) {
        log('addTotal:{host},{start}', host, new Date(start))
        this.increaseTime(host, start, (i, step) => i.total += step)
    }

    public addFocusAndTotal(host: string, focusStart: number, runStart: number) {
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

    public addOneTime(host: string) {
        log('addTime:{host}', host)
        this.updateOf(host, new Date(), (i: WastePerDay) => i.time += 1)
    }

    public selectByPage(callback: (page: PageInfo) => void, param?: QueryParam, page?: PageParam) {
        log("selectByPage:{param},{page}", param, page)
        page = page || { pageNum: 1, pageSize: 10 }
        this.select((origin: SiteInfo[]) => {
            let pageNum = page.pageNum
            let pageSize = page.pageSize
            pageNum === undefined || pageNum < 1 && (pageNum = 1)
            pageSize === undefined || pageSize < 1 && (pageSize = 10)

            const startIndex = (pageNum - 1) * pageSize
            const endIndex = (pageNum) * pageSize

            const total = origin.length
            const list: SiteInfo[] = startIndex >= total ? [] : origin.slice(startIndex, Math.min(endIndex, total))
            callback({ total, list })
        }, param)

    }

    /**
     * Select without page
     * 
     * @param callback  callback
     * @param param     condition
     */
    public select(callback: (result: SiteInfo[]) => void, param?: QueryParam) {
        log("select:{param}", param)
        param = param || new QueryParam()
        this.refresh((items: { waste: WastePerDay }) => {
            let result: SiteInfo[] = []
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
            log('Result of select: ', result)
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
        const paramTimeRange = param.timeRange
        const paramTotalRange = param.totalRange
        const paramFocusRange = param.focusRange

        if (paramHost) {
            if (!!param.fullHost && host !== paramHost) {
                return false
            }
            if (!param.fullHost && !host.includes(paramHost)) {
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

    private filterAfter(origin: SiteInfo[], param: QueryParam) {
        const paramHost = (param.host || '').trim()
        return paramHost ? origin.filter(o => o.host.includes(paramHost)) : origin
    }

    private mergeDomain(origin: SiteInfo[]): SiteInfo[] {
        const newSiteInfos = []
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
            newSiteInfos.push(map[key])
        }
        return newSiteInfos
    }

    private mergeDate(origin: SiteInfo[]): SiteInfo[] {
        const newSiteInfos = []
        const map = {}

        origin.forEach(o => this.merge(map, o, o.host).date = undefined)
        for (let key in map) {
            newSiteInfos.push(map[key])
        }
        return newSiteInfos
    }

    private merge(map: {}, origin: SiteInfo, key: string): SiteInfo {
        let exist: SiteInfo = map[key]
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
    public get(host: string, date: Date | string, callback: (info: WastePerDay) => void): void {
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
    public deleteByUrlAndDate(host: string, date: string, callback?: () => void): void {
        const key = this.generateKey(host, date)
        this.localStorage.remove(key, () => callback && callback())
    }

    /**
     * Delete by key
     *  
     * @param rows     site rows, the host and date mustn't be null
     * @param callback callback
     * @since 0.0.9
     */
    public delete(rows: SiteInfo[], callback?: () => void): void {
        const keys = rows.filter(({ date, host }) => !!host && !!date).map(({ host, date }) => this.generateKey(host, date))

        const promises: Promise<void>[] = keys.map(key =>
            new Promise<void>((resolve, _) => {
                this.localStorage.remove(key, resolve)
            })
        )
        Promise.all(promises).then(callback)
    }

    /**
     * @param host host 
     * @param start start date, inclusive
     * @param end end date, inclusive
     * @since 0.0.7
     */
    public deleteByUrlBetween(host: string, callback?: (date: string[]) => void, start?: string, end?: string) {
        const dateFilter = (date: string) => (start ? start <= date : true)
            && (end ? date <= end : true)
        this.refresh(items => {
            const keys = []
            for (const key in items) {
                // Key format: 20201112www.google.com
                key.length === 8 + host.length
                    && key.substring(8) === host
                    && dateFilter(key.substring(0, 8))
                    && keys.push(key)
            }
            this.localStorage.remove(keys, () => callback && callback(keys.map(k => k.substring(0, 8))))
        })
    }

    /**
     * Delete the record
     * 
     * @param host host
     * @param callback callback
     * @since 0.0.5
     */
    public deleteByUrl(host: string, callback?: (date: string[]) => void) {
        this.deleteByUrlBetween(host, callback)
    }
}

export default new TimeDatabase()