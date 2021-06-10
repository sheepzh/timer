import timerDatabase, { TimerCondition } from '../database/timer-database'
import whitelistDatabase from '../database/whitelist-database'
import archivedDatabase from '../database/archived-database'
import SiteInfo from '../entity/dto/site-info'
import { log } from '../common/logger'
import CustomizedDOmainMergeRuler from './domain-merge-ruler'
import DomainMergeRuleItem from '../entity/dto/domain-merge-rule-item'
import mergeRuleDatabase from '../database/merge-rule-database'
import WastePerDay from '../entity/dao/waste-per-day'
import iconUrlDatabase from '../database/icon-url-database'

declare type PageParam = {
    pageNum?: number
    pageSize?: number
}

declare type PageInfo = {
    total: number
    list: SiteInfo[]
}

export enum SortDirect {
    ASC = 1,
    DESC = -1
}

export type TimerQueryParam = TimerCondition & {
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
    sortOrder?: SortDirect
}

/**
 * Service of timer
 * @since 0.0.5
 */
class TimeService {

    async addFocusAndTotal(data: { [host: string]: { run: number, focus: number } }) {
        const whitelist: string[] = await whitelistDatabase.selectAll()
        for (const [host, item] of Object.entries(data)) {
            if (!whitelist.includes(host)) {
                timerDatabase.accumulate(host, new Date, WastePerDay.of(item.run, item.focus, 0))
            }
        }
    }

    async addOneTime(host: string) {
        const isWhitelist = await whitelistDatabase.includes(host)
        !isWhitelist && timerDatabase.accumulate(host, new Date(), WastePerDay.of(0, 0, 1))
    }

    /**
     * Query domain names
     * 
     * @param fuzzyQuery the part of domain name
     * @since 0.0.8
     */
    async listDomains(fuzzyQuery: string): Promise<Set<string>> {
        const condition: TimerCondition = {}
        condition.host = fuzzyQuery
        const rows = await timerDatabase.select(condition)
        const result: Set<string> = new Set()
        rows.forEach(row => result.add(row.host))
        return Promise.resolve(result)
    }

    /**
     * Archive the data and delete all of them
     * 
     * @param rows rows
     * @since 0.0.9
     */
    async archive(rows: SiteInfo[]): Promise<void> {
        await archivedDatabase.updateArchived(rows)
        return timerDatabase.delete(rows)
    }

    private async fillIconUrl(siteInfos: SiteInfo[]): Promise<void> {
        const hosts = siteInfos.map(o => o.host)
        const iconUrlMap = await iconUrlDatabase.get(...hosts)
        siteInfos.forEach(siteInfo => {
            siteInfo.iconUrl = iconUrlMap[siteInfo.host]
        })
        return Promise.resolve()
    }

    async select(param?: TimerQueryParam, needIconUrl?: boolean): Promise<SiteInfo[]> {
        log("service: select:{param}", param)
        param = param || {}
        let origin = await timerDatabase.select(param as TimerCondition)
        // Process after select
        // 1st merge
        if (param.mergeDomain) {
            // Merge with rules
            origin = await this.mergeDomain(origin)
            // filter again, cause of the exchange of the host, if the param.mergeDomain is true
            origin = this.filter(origin, param)
        }
        param.mergeDate && (origin = this.mergeDate(origin))
        // 2nd sort
        const sort = param.sort
        if (sort) {
            const order = param.sortOrder || SortDirect.ASC
            origin.sort((a, b) => {
                const aa = a[sort]
                const bb = b[sort]
                if (aa === bb)
                    return 0
                return order * (aa > bb ? 1 : -1)
            })
        }
        // 3rd get icon url if need
        if (!param.mergeDomain && needIconUrl) {
            await this.fillIconUrl(origin)
        }
        return Promise.resolve(origin)
    }

    async selectByPage(param?: TimerQueryParam, page?: PageParam): Promise<PageInfo> {
        log("selectByPage:{param},{page}", param, page)
        page = page || { pageNum: 1, pageSize: 10 }
        const origin: SiteInfo[] = await this.select(param)
        // Page
        let pageNum = page.pageNum
        let pageSize = page.pageSize
        pageNum === undefined || pageNum < 1 && (pageNum = 1)
        pageSize === undefined || pageSize < 1 && (pageSize = 10)
        const startIndex = (pageNum - 1) * pageSize
        const endIndex = (pageNum) * pageSize
        const total = origin.length
        const list: SiteInfo[] = startIndex >= total ? [] : origin.slice(startIndex, Math.min(endIndex, total))
        await this.fillIconUrl(list)
        return Promise.resolve({ total, list })
    }

    private filter(origin: SiteInfo[], param: TimerCondition) {
        const paramHost = (param.host || '').trim()
        return paramHost ? origin.filter(o => o.host.includes(paramHost)) : origin
    }

    private async mergeDomain(origin: SiteInfo[]): Promise<SiteInfo[]> {
        const newSiteInfos = []
        const map = {}

        // Generate ruler
        const mergeRuleItems: DomainMergeRuleItem[] = await mergeRuleDatabase.selectAll()
        const mergeRuler = new CustomizedDOmainMergeRuler(mergeRuleItems)

        origin.forEach(o => {
            const host = o.host
            const date = o.date
            let domain = mergeRuler.merge(host)
            const merged = this.merge(map, o, domain + date)
            merged.host = domain
            const mergedHosts = merged.mergedHosts || (merged.mergedHosts = [])
            mergedHosts.push(o)
        })
        for (let key in map) {
            newSiteInfos.push(map[key])
        }
        return newSiteInfos
    }

    private mergeDate(origin: SiteInfo[]): SiteInfo[] {
        const newSiteInfos = []
        const map = {}

        origin.forEach(o => this.merge(map, o, o.host).date = '')
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
}

export default new TimeService()