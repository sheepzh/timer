/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import TimerDatabase, { TimerCondition } from "@db/timer-database"
import ArchivedDatabase from "@db/archived-database"
import { log } from "../common/logger"
import CustomizedHostMergeRuler from "./components/host-merge-ruler"
import MergeRuleDatabase from "@db/merge-rule-database"
import IconUrlDatabase from "@db/icon-url-database"
import HostAliasDatabase from "@db/host-alias-database"
import { slicePageResult } from "./components/page-info"
import whitelistHolder from './components/whitelist-holder'
import { resultOf, rowOf } from "@util/stat"
import OptionDatabase from "@db/option-database"
import processor from "@src/background/backup/processor"
import { getBirthday } from "@util/time"

const storage = chrome.storage.local

const timerDatabase = new TimerDatabase(storage)
const archivedDatabase = new ArchivedDatabase(storage)
const iconUrlDatabase = new IconUrlDatabase(storage)
const hostAliasDatabase = new HostAliasDatabase(storage)
const mergeRuleDatabase = new MergeRuleDatabase(storage)
const optionDatabase = new OptionDatabase(storage)

export enum SortDirect {
    ASC = 1,
    DESC = -1
}

export type TimerQueryParam = TimerCondition & {
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

    async addFocusAndTotal(data: { [host: string]: { run: number, focus: number } }): Promise<timer.stat.ResultSet> {
        const toUpdate = {}
        Object.entries(data)
            .filter(([host]) => whitelistHolder.notContains(host))
            .forEach(([host, item]) => toUpdate[host] = resultOf(item.run, item.focus, 0))
        return timerDatabase.accumulateBatch(toUpdate, new Date())
    }

    async addOneTime(host: string) {
        timerDatabase.accumulate(host, new Date(), resultOf(0, 0, 1))
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
        const mergeRuleItems: timer.merge.Rule[] = await mergeRuleDatabase.selectAll()
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
     * @deprecated 1.2.0
     */
    async archive(rows: timer.stat.Row[]): Promise<void> {
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

    private processSort(origin: timer.stat.Row[], param: TimerQueryParam) {
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

    private async fillIconUrl(items: timer.stat.Row[]): Promise<void> {
        const hosts = items.map(o => o.host)
        const iconUrlMap = await iconUrlDatabase.get(...hosts)
        items.forEach(dataItem => dataItem.iconUrl = iconUrlMap[dataItem.host])
    }

    private async fillAlias(items: timer.stat.Row[], mergeHost: boolean): Promise<void> {
        const keys = items.map(({ host }) => ({ host, merged: mergeHost }))
        const allAlias = await hostAliasDatabase.get(...keys)
        const aliasMap = {}
        allAlias.forEach(({ host, name }) => aliasMap[host] = name)
        items.forEach(dataItem => dataItem.alias = aliasMap[dataItem.host])
    }

    async select(param?: TimerQueryParam, flagParam?: FillFlagParam): Promise<timer.stat.Row[]> {
        log("service: select:{param}", param)

        // Need match full host after merged
        let fullHost = undefined
        // If merged and full host
        // Then set the host blank
        // And filter them after merge
        param?.mergeHost && param?.fullHost && !(param.fullHost = false) && (fullHost = param?.host) && (param.host = undefined)

        param = param || {}
        let origin = await timerDatabase.select(param as TimerCondition)
        if (param.inclusiveRemote) {
            origin = await this.processRemote(param, origin)
        }
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
        flagParam?.alias && await this.fillAlias(origin, param.mergeHost)
        if (!param.mergeHost) {
            flagParam?.iconUrl && await this.fillIconUrl(origin)
        }
        // Filter merged host if full host
        fullHost && (origin = origin.filter(dataItem => dataItem.host === fullHost))
        return origin
    }

    private async processRemote(
        param: TimerCondition,
        origin: timer.stat.Row[]
    ): Promise<timer.stat.Row[]> {
        const { backupType, backupAuths } = await optionDatabase.getOption()
        const auth = backupAuths?.[backupType]
        const canReadRemote = await this.canReadRemote0(backupType, auth)
        if (!canReadRemote) {
            return origin
        }
        // Map to merge
        const originMap: Record<string, timer.stat.Row> = {}
        origin.forEach(row => originMap[this.keyOf(row)] = row)
        // Predicate with host
        const { host, fullHost } = param
        const predicate: (row: timer.stat.RowBase) => boolean = host
            // With host condition
            ? fullHost
                // Full match
                ? r => r.host === host
                // Fuzzy match
                : r => r.host && r.host.includes(host)
            // Without host condition
            : _r => true
        // 1. query remote
        let start: Date = undefined, end: Date = undefined
        if (param.date instanceof Array) {
            start = param.date?.[0]
            end = param.date?.[1]
        } else {
            start = param.date
        }
        start = start || getBirthday()
        end = end || new Date()
        const remote = await processor.query(backupType, auth, start, end)
        remote.filter(predicate)
            .forEach(row => {
                const key = this.keyOf(row)
                const exist = originMap[key]
                if (exist) {
                    exist.focus += row.focus || 0
                    exist.time += row.time || 0
                    exist.total += row.total || 0
                } else {
                    originMap[key] = { ...row, mergedHosts: [] }
                }
            })
        return Object.values(originMap)
    }

    private keyOf(row: timer.stat.RowKey) {
        return `${row.date}${row.host}`
    }

    async selectByPage(
        param?: TimerQueryParam,
        page?: timer.common.PageQuery,
        fillFlag?: FillFlagParam
    ): Promise<timer.common.PageResult<timer.stat.Row>> {
        log("selectByPage:{param},{page}", param, page)
        // Not fill at first
        const origin: timer.stat.Row[] = await this.select(param)
        const result: timer.common.PageResult<timer.stat.Row> = slicePageResult(origin, page)
        const list = result.list
        // Filter after page sliced
        if (fillFlag?.iconUrl) {
            if (param?.mergeHost) {
                for (const beforeMerge of list) await this.fillIconUrl(beforeMerge.mergedHosts)
            } else {
                await this.fillIconUrl(list)
            }
        }
        if (fillFlag?.alias) {
            await this.fillAlias(list, param.mergeHost)
        }
        console.log(result)
        return result
    }

    private filter(origin: timer.stat.Row[], param: TimerCondition) {
        const paramHost = (param.host || '').trim()
        return paramHost ? origin.filter(o => o.host.includes(paramHost)) : origin
    }

    private async mergeHost<T extends timer.stat.Row>(origin: T[]): Promise<T[]> {
        const newRows = []
        const map = {}

        // Generate ruler
        const mergeRuleItems: timer.merge.Rule[] = await mergeRuleDatabase.selectAll()
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
            newRows.push(map[key])
        }
        return newRows
    }

    private mergeDate<T extends timer.stat.Row>(origin: T[]): T[] {
        const newRows = []
        const map = {}

        origin.forEach(o => this.merge(map, o, o.host).date = '')
        for (let key in map) {
            newRows.push(map[key])
        }
        return newRows
    }

    private merge(map: {}, origin: timer.stat.Row, key: string): timer.stat.Row {
        let exist: timer.stat.Row = map[key]
        if (exist === undefined) {
            exist = map[key] = rowOf({ host: origin.host, date: origin.date })
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

    /**
     * Aable to read remote backup data
     * 
     * @since 1.2.0
     * @returns T/F
     */
    async canReadRemote(): Promise<boolean> {
        const { backupType, backupAuths } = await optionDatabase.getOption()
        return await this.canReadRemote0(backupType, backupAuths?.[backupType])
    }

    private async canReadRemote0(backupType: timer.backup.Type, auth: string): Promise<boolean> {
        return backupType && backupType !== 'none' && !await processor.test(backupType, auth)
    }
}

export default new TimerService()