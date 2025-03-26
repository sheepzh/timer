/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import MergeRuleDatabase from "@db/merge-rule-database"
import SiteDatabase from "@db/site-database"
import StatDatabase, { type StatCondition } from "@db/stat-database"
import { judgeVirtualFast } from "@util/pattern"
import { CATE_NOT_SET_ID, distinctSites, SiteMap } from "@util/site"
import { log } from "../../common/logger"
import CustomizedHostMergeRuler from "../components/host-merge-ruler"
import { slicePageResult } from "../components/page-info"
import { cvt2StatRow } from "./common"
import { mergeCate } from "./merge/cate"
import { mergeDate } from "./merge/date"
import { mergeHost } from "./merge/host"
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
     * Group by the category
     */
    mergeCate?: boolean
    /**
     * Merge items of the same host from different days
     */
    mergeDate?: boolean
    /**
     * Categories
     *
     * @since 3.0.0
     */
    cateIds?: number[]
    /**
     * The name of sorted column
     */
    sort?: keyof timer.core.Row
    /**
     * 1 asc, -1 desc
     */
    sortOrder?: SortDirect
}

function cvtStatRow2BaseKey(statRow: timer.stat.Row): timer.core.RowKey | undefined {
    const { siteKey, date } = statRow || {}
    if (!date) return undefined
    const { type, host } = siteKey || {}
    if (!host || type !== 'normal') return undefined
    return { date, host }
}

function extractAllSiteKeys(rows: timer.stat.Row[], container: timer.site.SiteKey[]) {
    rows?.forEach(row => {
        const { siteKey, mergedRows } = row || {}
        siteKey && container.push(siteKey)
        mergedRows?.length && extractAllSiteKeys(mergedRows, container)
    })
}

function fillRowWithSiteInfo(row: timer.stat.Row, siteMap: SiteMap<timer.site.SiteInfo>): void {
    const { siteKey, mergedRows } = row || {}
    if (!siteKey) return

    mergedRows?.map(m => fillRowWithSiteInfo(m, siteMap))
    const siteInfo = siteMap.get(siteKey)
    if (siteInfo) {
        const { cate, iconUrl, alias } = siteInfo
        row.cateId = cate
        row.alias = alias
        row.iconUrl = iconUrl
    }
}

function filterByCateIds(rows: timer.stat.Row[], cateIds: number[]): timer.stat.Row[] {
    return rows?.filter(({ siteKey, cateId }) => {
        const siteType = siteKey?.type
        if (siteType && siteType !== 'normal') return false
        return cateIds?.includes?.(cateId ?? CATE_NOT_SET_ID)
    })
}

/**
 * Service of timer
 * @since 0.0.5
 */
class StatService {
    /**
     * Query hosts
     *
     * @param fuzzyQuery the part of host
     * @since 0.0.8
     */
    async listHosts(fuzzyQuery?: string): Promise<Record<timer.site.Type, string[]>> {
        const rows = await statDatabase.select()
        const allHosts: Set<string> = new Set(rows.map(row => row.host))
        // Generate ruler
        const mergeRuleItems: timer.merge.Rule[] = await mergeRuleDatabase.selectAll()
        const mergeRuler = new CustomizedHostMergeRuler(mergeRuleItems)

        const normalSet: Set<string> = new Set()
        const mergedSet: Set<string> = new Set()
        const virtualSet: Set<string> = new Set()

        const allHostArr = Array.from(allHosts)

        allHostArr.forEach(host => {
            if (judgeVirtualFast(host)) {
                virtualSet.add(host)
                return
            }
            normalSet.add(host)
            const mergedHost = mergeRuler.merge(host)
            mergedSet.add(mergedHost)
        })

        let normal = Array.from(normalSet)
        let merged = Array.from(mergedSet)
        let virtual = Array.from(virtualSet)
        if (fuzzyQuery) {
            normal = normal.filter(host => host?.includes(fuzzyQuery))
            merged = merged.filter(host => host?.includes(fuzzyQuery))
            virtual = virtual.filter(host => host?.includes(fuzzyQuery))
        }

        return { normal, merged, virtual }
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

    private processSort(origin: timer.stat.Row[], param?: StatQueryParam) {
        const { sort, sortOrder } = param || {}
        if (!sort) return

        const order = sortOrder || 'ASC'
        const sortValue: (row: timer.stat.Row) => string | number | undefined = sort === 'host'
            ? r => r.siteKey?.host ?? ''
            : r => r[sort] ?? 0
        origin.sort((a, b) => {
            const aa = sortValue(a)
            const bb = sortValue(b)
            if (aa === bb) return 0
            if (aa === undefined) return -1
            if (bb === undefined) return 1
            return (order === 'ASC' ? 1 : -1) * (aa > bb ? 1 : -1)
        })
    }

    async select(param?: StatQueryParam, fillSiteInfo?: boolean): Promise<timer.stat.Row[]> {
        log("service: select:{param}", param)
        let rows = await this.filterRows(param)
        const { mergeCate: needMergeCate, cateIds } = param || {}

        if (fillSiteInfo || needMergeCate || cateIds?.length) {
            await this.fillSite(rows)
        }
        if (cateIds?.length) {
            rows = filterByCateIds(rows, cateIds)
        }
        if (needMergeCate) {
            rows = await mergeCate(rows)
        }
        this.processSort(rows, param)
        return rows
    }

    private async filterRows(param?: StatQueryParam): Promise<timer.stat.Row[]> {
        // Need match full host after merged
        let fullHost: string | undefined = undefined
        // If merged and full host
        // Then set the host blank
        // And filter them after merge
        param?.mergeHost && param?.fullHost && !(param.fullHost = false) && (fullHost = param?.host) && (param.host = undefined)

        param = param || {}
        let origin = await this.selectBase(param)

        let statRows = origin?.map(cvt2StatRow) ?? []
        if (param.inclusiveRemote) {
            statRows = await processRemote(param, statRows)
        }

        // Process after select
        // 1st merge
        if (param.mergeHost) {
            // Merge with rules
            statRows = await mergeHost(statRows)
            // filter again, cause of the exchange of the host, if the param.mergeHost is true
            statRows = this.filter(statRows, param)
        }
        param.mergeDate && (statRows = mergeDate(statRows))
        // Filter merged host if full host
        fullHost && (statRows = statRows.filter(dataItem => dataItem.siteKey?.host === fullHost))
        return statRows
    }

    private async fillSite(rows: timer.stat.Row[]): Promise<true> {
        let keys: timer.site.SiteKey[] = []
        extractAllSiteKeys(rows, keys)
        keys = distinctSites(keys)

        const siteInfos = await siteDatabase.getBatch(keys)
        const siteInfoMap = new SiteMap<timer.site.SiteInfo>()
        siteInfos.forEach(siteInfo => siteInfoMap.put(siteInfo, siteInfo))

        rows.forEach(item => fillRowWithSiteInfo(item, siteInfoMap))
        return true
    }

    async selectBase(cond: StatCondition): Promise<timer.core.Row[]> {
        return statDatabase.select(cond)
    }

    async selectByPage(
        param?: StatQueryParam,
        page?: timer.common.PageQuery,
    ): Promise<timer.common.PageResult<timer.stat.Row>> {
        log("selectByPage:{param},{page}", param, page)
        // Not fill at first
        let origin = await this.filterRows(param)
        const { mergeCate: needMergeCate, cateIds } = param || {}
        let siteFilled = false
        if (cateIds?.length) {
            siteFilled = await this.fillSite(origin)
            origin = filterByCateIds(origin, cateIds)
        }
        if (needMergeCate) {
            // If merge cate, fill firstly
            siteFilled = siteFilled || await this.fillSite(origin)
            origin = await mergeCate(origin)
        }

        this.processSort(origin, param)
        let result = slicePageResult(origin, page)

        if (!siteFilled) await this.fillSite(result?.list)

        log("result of selectByPage:{param}, {page}, {result}", param, page, result)
        return result
    }

    private filter(origin: timer.stat.Row[], param: StatCondition) {
        const paramHost = (param.host || '').trim()
        return paramHost ? origin.filter(o => o.siteKey?.host?.includes?.(paramHost)) : origin
    }

    /**
     * Enable to read remote backup data
     *
     * @since 1.2.0
     * @returns T/F
     */
    canReadRemote = canReadRemote

    async batchDelete(rows: timer.stat.Row[]) {
        if (!rows?.length) return
        const baseKeys: timer.core.RowKey[] = rows.map(cvtStatRow2BaseKey).filter(k => !!k)
        await this.batchDeleteBase(baseKeys)
    }

    async batchDeleteBase(keys: timer.core.RowKey[]): Promise<void> {
        await statDatabase.delete(keys)
    }
}

export default new StatService()