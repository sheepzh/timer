import TimerDatabase, { TimerCondition } from '../database/timer-database'
import WhitelistDatabase from '../database/whitelist-database'
import ArchivedDatabase from '../database/archived-database'
import SiteInfo from '../entity/dto/site-info'
import { log } from '../common/logger'
import CustomizedDomainMergeRuler from './domain-merge-ruler'
import DomainMergeRuleItem from '../entity/dto/domain-merge-rule-item'
import MergeRuleDatabase from '../database/merge-rule-database'
import WastePerDay, { WasteData } from '../entity/dao/waste-per-day'
import IconUrlDatabase from '../database/icon-url-database'

const storage = chrome.storage.local

const timerDatabase = new TimerDatabase(storage)
const archivedDatabase = new ArchivedDatabase(storage)
const iconUrlDatabase = new IconUrlDatabase(storage)
const mergeRuleDatabase = new MergeRuleDatabase(storage)
const whitelistDatabase = new WhitelistDatabase(storage)

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

export type DomainSet = {
    origin: Set<string>
    merged: Set<string>
}

/**
 * Service of timer
 * @since 0.0.5
 */
class TimeService {

    private whitelist: string[] = []

    constructor() {
        const whitelistSetter = (whitelist: string[]) => this.whitelist = whitelist
        whitelistDatabase.selectAll().then(whitelistSetter)
        whitelistDatabase.addChangeListener(whitelistSetter)
    }

    async addFocusAndTotal(data: { [host: string]: { run: number, focus: number } }): Promise<WasteData> {
        const toUpdate = {}
        Object.entries(data)
            .filter(([host]) => !this.whitelist.includes(host))
            .forEach(([host, item]) => toUpdate[host] = WastePerDay.of(item.run, item.focus, 0))
        return timerDatabase.accumulateBatch(toUpdate, new Date())
    }

    async addOneTime(host: string) {
        timerDatabase.accumulate(host, new Date(), WastePerDay.of(0, 0, 1))
    }

    /**
     * Query domain names
     * 
     * @param fuzzyQuery the part of domain name
     * @since 0.0.8
     */
    async listDomains(fuzzyQuery: string): Promise<DomainSet> {
        const rows = await timerDatabase.select()
        const allHosts: Set<string> = new Set()
        rows.map(row => row.host).forEach(host => allHosts.add(host))
        // Generate ruler
        const mergeRuleItems: DomainMergeRuleItem[] = await mergeRuleDatabase.selectAll()
        const mergeRuler = new CustomizedDomainMergeRuler(mergeRuleItems)

        const origin: Set<string> = new Set()
        const merged: Set<string> = new Set()

        const allHostArr = Array.from(allHosts)
        allHostArr
            .filter(host => host.includes(fuzzyQuery))
            .forEach(host => origin.add(host))
        allHostArr
            .map(host => mergeRuler.merge(host))
            .filter(host => host.includes(fuzzyQuery))
            .forEach(host => merged.add(host))

        return Promise.resolve({ origin, merged })
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

    private processSort(origin: SiteInfo[], param: TimerQueryParam) {
        const { sort, sortOrder } = param
        if (!sort) return

        const order = sortOrder || SortDirect.ASC
        origin.sort((a, b) => {
            const aa = a[sort]
            const bb = b[sort]
            if (aa === bb) return 0
            return order * (aa > bb ? 1 : -1)
        })
    }

    private async fillIconUrl(siteInfos: SiteInfo[]): Promise<void> {
        const hosts = siteInfos.map(o => o.host)
        const iconUrlMap = await iconUrlDatabase.get(...hosts)
        siteInfos.forEach(siteInfo => siteInfo.iconUrl = iconUrlMap[siteInfo.host])
        return Promise.resolve()
    }

    async select(param?: TimerQueryParam, needIconUrl?: boolean): Promise<SiteInfo[]> {
        log("service: select:{param}", param)

        // Need match full host after merged
        let fullHost = undefined
        // If merged and full host
        // Then set the host blank
        // And filter them after merge
        param.mergeDomain && param.fullHost && !(param.fullHost = false) && (fullHost = param.host) && (param.host = undefined)

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
        this.processSort(origin, param)
        // 3rd get icon url if need
        !param.mergeDomain && needIconUrl && await this.fillIconUrl(origin)
        // Filter merged domain if full host
        fullHost && (origin = origin.filter(siteInfo => siteInfo.host === fullHost))
        return origin
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
        if (param.mergeDomain) {
            for (const origin of list) await this.fillIconUrl(origin.mergedHosts)
        } else {
            await this.fillIconUrl(list)
        }
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
        const mergeRuler = new CustomizedDomainMergeRuler(mergeRuleItems)

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
            exist = map[key] = new SiteInfo({ host: origin.host, date: origin.date })
            exist.mergedHosts = origin.mergedHosts || []
        }
        exist.time += origin.time
        exist.focus += origin.focus
        exist.total += origin.total

        origin.mergedHosts && origin.mergedHosts.forEach(originHost =>
            !exist.mergedHosts.find(existOrigin => existOrigin.host === originHost.host) && exist.mergedHosts.push(originHost)
        )
        return exist
    }
}

export default new TimeService()