/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import TimerDatabase, { TimerCondition } from "@db/timer-database"
import ArchivedDatabase from "@db/archived-database"
import DataItem from "@entity/dto/data-item"
import { log } from "../common/logger"
import CustomizedHostMergeRuler from "./components/host-merge-ruler"
import HostMergeRuleItem from "@entity/dto/host-merge-rule-item"
import MergeRuleDatabase from "@db/merge-rule-database"
import WastePerDay, { WasteData } from "@entity/dao/waste-per-day"
import IconUrlDatabase from "@db/icon-url-database"
import HostAliasDatabase from "@db/host-alias-database"
import { PageParam, PageResult, slicePageResult } from "./components/page-info"
import whitelistHolder from './components/whitelist-holder'

const storage = chrome.storage.local

const timerDatabase = new TimerDatabase(storage)
const archivedDatabase = new ArchivedDatabase(storage)
const iconUrlDatabase = new IconUrlDatabase(storage)
const hostAliasDatabase = new HostAliasDatabase(storage)
const mergeRuleDatabase = new MergeRuleDatabase(storage)

export enum SortDirect {
    ASC = 1,
    DESC = -1
}

export type TimerQueryParam = TimerCondition & {
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
    sort?: keyof DataItem
    /**
     * 1 asc, -1 desc
     */
    sortOrder?: SortDirect
}

/**
 * @since 0.5.0
 */
export type FillFlagParam = {
    /**
     * Whether to fill the icon url
     */
    iconUrl?: boolean
    /**
     * Whether to fill the alias
     */
    alias?: boolean
}

export type HostSet = {
    origin: Set<string>
    merged: Set<string>
}

/**
 * Service of timer
 * @since 0.0.5
 */
class TimerService {

    async addFocusAndTotal(data: { [host: string]: { run: number, focus: number } }): Promise<WasteData> {
        const toUpdate = {}
        Object.entries(data)
            .filter(([host]) => whitelistHolder.notContains(host))
            .forEach(([host, item]) => toUpdate[host] = WastePerDay.of(item.run, item.focus, 0))
        return timerDatabase.accumulateBatch(toUpdate, new Date())
    }

    async addOneTime(host: string) {
        timerDatabase.accumulate(host, new Date(), WastePerDay.of(0, 0, 1))
    }

    /**
     * Query hosts
     * 
     * @param fuzzyQuery the part of host
     * @since 0.0.8
     */
    async listHosts(fuzzyQuery: string): Promise<HostSet> {
        const rows = await timerDatabase.select()
        const allHosts: Set<string> = new Set()
        rows.map(row => row.host).forEach(host => allHosts.add(host))
        // Generate ruler
        const mergeRuleItems: HostMergeRuleItem[] = await mergeRuleDatabase.selectAll()
        const mergeRuler = new CustomizedHostMergeRuler(mergeRuleItems)

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

        return { origin, merged }
    }

    /**
     * Archive the data and delete all of them
     * 
     * @param rows rows
     * @since 0.0.9
     */
    async archive(rows: DataItem[]): Promise<void> {
        await archivedDatabase.updateArchived(rows)
        return timerDatabase.delete(rows)
    }

    /**
     * Count the items
     * 
     * @param condition condition to count
     * @since 1.0.2
     */
    async count(condition: TimerCondition): Promise<number> {
        log("service: count: {condition}", condition)
        const count = await timerDatabase.count(condition)
        log("service: count: {result}", count)
        return count
    }

    private processSort(origin: DataItem[], param: TimerQueryParam) {
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

    private async fillIconUrl(items: DataItem[]): Promise<void> {
        const hosts = items.map(o => o.host)
        const iconUrlMap = await iconUrlDatabase.get(...hosts)
        items.forEach(dataItem => dataItem.iconUrl = iconUrlMap[dataItem.host])
    }

    private async fillAlias(items: DataItem[]): Promise<void> {
        const hosts: string[] = items.map(o => o.host)
        const aliasMap = await hostAliasDatabase.get(...hosts)
        items.forEach(dataItem => dataItem.alias = aliasMap[dataItem.host]?.name)
    }

    async select(param?: TimerQueryParam, flagParam?: FillFlagParam): Promise<DataItem[]> {
        log("service: select:{param}", param)

        // Need match full host after merged
        let fullHost = undefined
        // If merged and full host
        // Then set the host blank
        // And filter them after merge
        param?.mergeHost && param?.fullHost && !(param.fullHost = false) && (fullHost = param?.host) && (param.host = undefined)

        param = param || {}
        let origin = await timerDatabase.select(param as TimerCondition)
        // Process after select
        // 1st merge
        if (param.mergeHost) {
            // Merge with rules
            origin = await this.mergeHost(origin)
            // filter again, cause of the exchange of the host, if the param.mergeHost is true
            origin = this.filter(origin, param)
        }
        param.mergeDate && (origin = this.mergeDate(origin))
        // 2nd sort
        this.processSort(origin, param)
        // 3rd get icon url and alias if need
        if (!param.mergeHost) {
            flagParam?.iconUrl && await this.fillIconUrl(origin)
            flagParam?.alias && await this.fillAlias(origin)
        }
        // Filter merged host if full host
        fullHost && (origin = origin.filter(DataItem => DataItem.host === fullHost))
        return origin
    }

    async selectByPage(param?: TimerQueryParam, page?: PageParam): Promise<PageResult<DataItem>> {
        log("selectByPage:{param},{page}", param, page)
        const origin: DataItem[] = await this.select(param)
        const result: PageResult<DataItem> = slicePageResult(origin, page)
        const list = result.list
        if (param.mergeHost) {
            for (const beforeMerge of list) await this.fillIconUrl(beforeMerge.mergedHosts)
        } else {
            await this.fillIconUrl(list)
            await this.fillAlias(list)
        }
        return result
    }

    private filter(origin: DataItem[], param: TimerCondition) {
        const paramHost = (param.host || '').trim()
        return paramHost ? origin.filter(o => o.host.includes(paramHost)) : origin
    }

    private async mergeHost(origin: DataItem[]): Promise<DataItem[]> {
        const newDataItems = []
        const map = {}

        // Generate ruler
        const mergeRuleItems: HostMergeRuleItem[] = await mergeRuleDatabase.selectAll()
        const mergeRuler = new CustomizedHostMergeRuler(mergeRuleItems)

        origin.forEach(o => {
            const host = o.host
            const date = o.date
            let mergedHost = mergeRuler.merge(host)
            const merged = this.merge(map, o, mergedHost + date)
            merged.host = mergedHost
            const mergedHosts = merged.mergedHosts || (merged.mergedHosts = [])
            mergedHosts.push(o)
        })
        for (let key in map) {
            newDataItems.push(map[key])
        }
        return newDataItems
    }

    private mergeDate(origin: DataItem[]): DataItem[] {
        const newDataItems = []
        const map = {}

        origin.forEach(o => this.merge(map, o, o.host).date = '')
        for (let key in map) {
            newDataItems.push(map[key])
        }
        return newDataItems
    }

    private merge(map: {}, origin: DataItem, key: string): DataItem {
        let exist: DataItem = map[key]
        if (exist === undefined) {
            exist = map[key] = new DataItem({ host: origin.host, date: origin.date })
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

export default new TimerService()