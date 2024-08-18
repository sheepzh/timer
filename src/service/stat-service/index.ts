/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import StatDatabase, { StatCondition } from "@db/stat-database"
import { log } from "../../common/logger"
import CustomizedHostMergeRuler from "../components/host-merge-ruler"
import MergeRuleDatabase from "@db/merge-rule-database"
import { slicePageResult } from "../components/page-info"
import whitelistHolder from '../components/whitelist-holder'
import { resultOf } from "@util/stat"
import SiteDatabase from "@db/site-database"
import { mergeDate, mergeHost } from "./merge"
import virtualSiteHolder from "@service/components/virtual-site-holder"
import { judgeVirtualFast } from "@util/pattern"
import { canReadRemote, processRemote } from "./remote"

const storage = chrome.storage.local

const statDatabase = new StatDatabase(storage)
const mergeRuleDatabase = new MergeRuleDatabase(storage)
const siteDatabase = new SiteDatabase(storage)

export type SortDirect = 'ASC' | 'DESC'

export type StatQueryParam = StatCondition & {
    /**
     * Inclusive remote data
     *
     * If true the date range MUST NOT be unlimited
     *
     * @since 1.2.0
     */
    inclusiveRemote?: boolean
    /**
     * Group by the root host
     */
    mergeHost?: boolean
    /**
     * Merge items of the same host from different days
     */
    mergeDate?: boolean
    /**
     * The name of sorted column
     */
    sort?: keyof timer.stat.Row
    /**
     * 1 asc, -1 desc
     */
    sortOrder?: SortDirect
}

export type HostSet = {
    origin: Set<string>
    merged: Set<string>
    virtual: Set<string>
}

/**
 * Service of timer
 * @since 0.0.5
 */
class StatService {

    async addFocusTime(host: string, url: string, focusTime: number): Promise<void> {
        if (whitelistHolder.contains(host, url)) return

        const resultSet: timer.stat.ResultSet = { [host]: resultOf(focusTime, 0) }
        const virtualHosts = virtualSiteHolder.findMatched(url)
        virtualHosts.forEach(virtualHost => resultSet[virtualHost] = resultOf(focusTime, 0))

        await statDatabase.accumulateBatch(resultSet, new Date())
    }

    async addOneTime(host: string, url: string) {
        if (whitelistHolder.contains(host, url)) return

        const resultSet: timer.stat.ResultSet = { [host]: resultOf(0, 1) }
        virtualSiteHolder.findMatched(url).forEach(virtualHost => resultSet[virtualHost] = resultOf(0, 1))
        await statDatabase.accumulateBatch(resultSet, new Date())
    }

    /**
     * Query hosts
     *
     * @param fuzzyQuery the part of host
     * @since 0.0.8
     */
    async listHosts(fuzzyQuery: string): Promise<HostSet> {
        const rows = await statDatabase.select()
        const allHosts: Set<string> = new Set(rows.map(row => row.host))
        // Generate ruler
        const mergeRuleItems: timer.merge.Rule[] = await mergeRuleDatabase.selectAll()
        const mergeRuler = new CustomizedHostMergeRuler(mergeRuleItems)

        const origin: Set<string> = new Set()
        const merged: Set<string> = new Set()

        const allHostArr = Array.from(allHosts)

        allHostArr.forEach(host => {
            if (judgeVirtualFast(host)) return
            host.includes(fuzzyQuery) && origin.add(host)
            const mergedHost = mergeRuler.merge(host)
            mergedHost?.includes(fuzzyQuery) && merged.add(mergedHost)
        })

        const virtualSites = await siteDatabase.select({ virtual: true })
        const virtual: Set<string> = new Set(
            virtualSites
                .map(site => site.host)
                .filter(host => host?.includes(fuzzyQuery))
        )
        return { origin, merged, virtual }
    }

    /**
     * Count the items
     *
     * @param condition condition to count
     * @since 1.0.2
     */
    async count(condition: StatCondition): Promise<number> {
        log("service: count: {condition}", condition)
        const count = await statDatabase.count(condition)
        log("service: count: {result}", count)
        return count
    }

    private processSort(origin: timer.stat.Row[], param: StatQueryParam) {
        const { sort, sortOrder } = param
        if (!sort) return

        const order = sortOrder || 'ASC'
        origin.sort((a, b) => {
            const aa = a[sort]
            const bb = b[sort]
            if (aa === bb) return 0
            return (order === 'ASC' ? 1 : -1) * (aa > bb ? 1 : -1)
        })
    }

    private async fillSiteInfo(items: timer.stat.Row[], mergeHost: boolean) {
        const keys: timer.site.SiteKey[] = items.map(({ host }) => ({ host, merged: mergeHost, virtual: judgeVirtualFast(host) }))
        const siteInfos = await siteDatabase.getBatch(keys)
        const siteInfoMap: Record<string, timer.site.SiteInfo> = {}
        siteInfos.forEach(siteInfo => {
            const { host, merged, virtual } = siteInfo
            const key = `${merged ? 1 : 0}${virtual ? 1 : 0}${host}`
            siteInfoMap[key] = siteInfo
        })
        items.forEach(item => {
            const { host } = item
            const key = `${mergeHost ? 1 : 0}${judgeVirtualFast(host) ? 1 : 0}${host}`
            const siteInfo = siteInfoMap[key]
            if (siteInfo) {
                item.iconUrl = siteInfo.iconUrl
                item.alias = siteInfo.alias
            }
        })
    }

    async select(param?: StatQueryParam, fillSiteInfo?: boolean): Promise<timer.stat.Row[]> {
        log("service: select:{param}", param)

        // Need match full host after merged
        let fullHost = undefined
        // If merged and full host
        // Then set the host blank
        // And filter them after merge
        param?.mergeHost && param?.fullHost && !(param.fullHost = false) && (fullHost = param?.host) && (param.host = undefined)

        param = param || {}
        let origin = await statDatabase.select(param as StatCondition)
        if (param.inclusiveRemote) {
            origin = await processRemote(param, origin)
        }
        // Process after select
        // 1st merge
        if (param.mergeHost) {
            // Merge with rules
            origin = await mergeHost(origin)
            // filter again, cause of the exchange of the host, if the param.mergeHost is true
            origin = this.filter(origin, param)
        }
        param.mergeDate && (origin = mergeDate(origin))
        // 2nd sort
        this.processSort(origin, param)
        // 3rd get icon url and alias if need
        fillSiteInfo && await this.fillSiteInfo(origin, param.mergeHost)
        // Filter merged host if full host
        fullHost && (origin = origin.filter(dataItem => dataItem.host === fullHost))
        return origin
    }

    getResult(host: string, date: Date): Promise<timer.stat.Result> {
        return statDatabase.get(host, date)
    }

    async selectByPage(
        param?: StatQueryParam,
        page?: timer.common.PageQuery,
        fillSiteInfo?: boolean
    ): Promise<timer.common.PageResult<timer.stat.Row>> {
        log("selectByPage:{param},{page}", param, page)
        // Not fill at first
        const origin: timer.stat.Row[] = await this.select(param, fillSiteInfo)
        const result: timer.common.PageResult<timer.stat.Row> = slicePageResult(origin, page)
        const list = result.list
        // Filter after page sliced
        if (fillSiteInfo && param?.mergeHost) {
            for (const beforeMerge of list) await this.fillSiteInfo(beforeMerge.mergedHosts, false)
        }
        log("result of selectByPage:{param}, {page}, {result}", param, page, result)
        return result
    }

    private filter(origin: timer.stat.Row[], param: StatCondition) {
        const paramHost = (param.host || '').trim()
        return paramHost ? origin.filter(o => o.host.includes(paramHost)) : origin
    }

    /**
     * Enable to read remote backup data
     *
     * @since 1.2.0
     * @returns T/F
     */
    canReadRemote = canReadRemote

    async batchDelete(rows: timer.stat.Row[]) {
        await statDatabase.delete(rows)
    }
}

export default new StatService()