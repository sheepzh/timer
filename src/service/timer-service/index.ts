/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import TimerDatabase, { TimerCondition } from "@db/timer-database"
import { log } from "../../common/logger"
import CustomizedHostMergeRuler from "../components/host-merge-ruler"
import MergeRuleDatabase from "@db/merge-rule-database"
import IconUrlDatabase from "@db/icon-url-database"
import HostAliasDatabase from "@db/host-alias-database"
import { slicePageResult } from "../components/page-info"
import whitelistHolder from '../components/whitelist-holder'
import { resultOf } from "@util/stat"
import OptionDatabase from "@db/option-database"
import processor from "@src/common/backup/processor"
import { getBirthday } from "@util/time"
import { mergeDate, mergeHost } from "./merge"

const storage = chrome.storage.local

const timerDatabase = new TimerDatabase(storage)
const iconUrlDatabase = new IconUrlDatabase(storage)
const hostAliasDatabase = new HostAliasDatabase(storage)
const mergeRuleDatabase = new MergeRuleDatabase(storage)
const optionDatabase = new OptionDatabase(storage)

export type SortDirect = 'ASC' | 'DESC'

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

function calcFocusInfo(timeInfo: TimeInfo): number {
    return Object.values(timeInfo).reduce((a, b) => a + b, 0)
}

const keyOf = (row: timer.stat.RowKey) => `${row.date}${row.host}`

async function processRemote(param: TimerCondition, origin: timer.stat.Row[]): Promise<timer.stat.Row[]> {
    const { backupType, backupAuths } = await optionDatabase.getOption()
    const auth = backupAuths?.[backupType]
    const canReadRemote = await canReadRemote0(backupType, auth)
    if (!canReadRemote) {
        return origin
    }
    // Map to merge
    const originMap: Record<string, timer.stat.Row> = {}
    origin.forEach(row => originMap[keyOf(row)] = {
        ...row,
        composition: {
            focus: [row.focus],
            time: [row.time],
        }
    })
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
    remote.filter(predicate).forEach(row => processRemoteRow(originMap, row))
    return Object.values(originMap)
}

function processRemoteRow(rowMap: Record<string, timer.stat.Row>, row: timer.stat.Row) {
    const key = keyOf(row)
    let exist = rowMap[key]
    !exist && (exist = rowMap[key] = {
        date: row.date,
        host: row.host,
        time: 0,
        focus: 0,
        composition: {
            focus: [],
            time: [],
        },
        mergedHosts: [],
    })

    const focus = row.focus || 0
    const time = row.time || 0

    exist.focus += focus
    exist.time += time
    focus && exist.composition.focus.push({ cid: row.cid, cname: row.cname, value: focus })
    time && exist.composition.time.push({ cid: row.cid, cname: row.cname, value: time })
}


async function canReadRemote0(backupType: timer.backup.Type, auth: string): Promise<boolean> {
    return backupType && backupType !== 'none' && !await processor.test(backupType, auth)
}

/**
 * Service of timer
 * @since 0.0.5
 */
class TimerService {

    async addFocusAndTotal(data: { [host: string]: TimeInfo }): Promise<timer.stat.ResultSet> {
        const toUpdate = {}
        Object.entries(data)
            .filter(([host]) => whitelistHolder.notContains(host))
            .forEach(([host, timeInfo]) => toUpdate[host] = resultOf(calcFocusInfo(timeInfo), 0))
        return timerDatabase.accumulateBatch(toUpdate, new Date())
    }

    async addOneTime(host: string) {
        timerDatabase.accumulate(host, new Date(), resultOf(0, 1))
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

        const order = sortOrder || 'ASC'
        origin.sort((a, b) => {
            const aa = a[sort]
            const bb = b[sort]
            if (aa === bb) return 0
            return (order === 'ASC' ? 1 : -1) * (aa > bb ? 1 : -1)
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
        flagParam?.alias && await this.fillAlias(origin, param.mergeHost)
        if (!param.mergeHost) {
            flagParam?.iconUrl && await this.fillIconUrl(origin)
        }
        // Filter merged host if full host
        fullHost && (origin = origin.filter(dataItem => dataItem.host === fullHost))
        return origin
    }

    getResult(host: string, date: Date): Promise<timer.stat.Result> {
        return timerDatabase.get(host, date)
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
        return result
    }

    private filter(origin: timer.stat.Row[], param: TimerCondition) {
        const paramHost = (param.host || '').trim()
        return paramHost ? origin.filter(o => o.host.includes(paramHost)) : origin
    }

    /**
     * Aable to read remote backup data
     * 
     * @since 1.2.0
     * @returns T/F
     */
    async canReadRemote(): Promise<boolean> {
        const { backupType, backupAuths } = await optionDatabase.getOption()
        return await canReadRemote0(backupType, backupAuths?.[backupType])
    }
}

export default new TimerService()