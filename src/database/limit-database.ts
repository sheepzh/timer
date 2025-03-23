/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { formatTimeYMD, MILL_PER_DAY } from "@util/time"
import BaseDatabase from "./common/base-database"
import { REMAIN_WORD_PREFIX } from "./common/constant"

const KEY = REMAIN_WORD_PREFIX + 'LIMIT'

type DateRecords = {
    [date: string]: {
        mill: number
        visit: number
        delay?: number
    }
}

type LimitRecord = timer.limit.Rule & {
    records: DateRecords
}

type ItemValue = {
    /**
     * ID
     */
    i: number
    /**
     * Condition
     */
    c: string[]
    /**
     * Name
     */
    n: string
    /**
     * Limited time, second
     */
    t?: number
    /**
     * Limited count
     */
    ct?: number
    /**
     * Limited time weekly, second
     */
    wt?: number
    /**
     * Limited count weekly
     */
    wct?: number
    /**
     * Limited time per visit, second
     */
    v?: number
    /**
     * Forbidden periods
     */
    p?: Vector<2>[]
    /**
     * Enabled flag
     */
    e: boolean
    /**
     * Allow to delay
     */
    ad: boolean
    /**
     * Effective days
     */
    wd?: number[]
    /**
     * Date records
     */
    r?: {
        [date: string]: {
            /**
            * Milliseconds
            */
            m: number
            /**
             * Visit count
             */
            c: number
            /**
             * Delay count
             */
            d?: number
        }
    }
}

const cvtItem2Rec = (item: ItemValue): LimitRecord => {
    const { i, n, c, t, v, p, e, ad, wd, wt, r, ct, wct, } = item
    const records: DateRecords = {}
    Object.entries(r || {}).forEach?.(([date, { m, d, c }]) => records[date] = { mill: m, delay: d, visit: c })
    return {
        id: i,
        name: n,
        cond: c,
        time: t,
        count: ct,
        weekly: wt,
        weeklyCount: wct,
        visitTime: v,
        periods: p?.map(i => [i?.[0], i?.[1]]),
        enabled: e,
        allowDelay: !!ad,
        weekdays: wd,
        records: records,
    }
}

type Items = Record<number, ItemValue>

function migrate(exist: Items, toMigrate: any) {
    const idBase = Object.keys(exist).map(parseInt).sort().reverse()?.[0] ?? 0 + 1
    Object.values(toMigrate).forEach((value, idx) => {
        const id = idBase + idx
        const itemValue: ItemValue = value as ItemValue
        const { c, n, t, e, ad, v, p } = itemValue
        exist[id] = {
            i: id, c, n, t, e: !!e, ad: !!ad, v, p,
            r: {},
        }
    })
}

/**
 * Time limit
 *
 * @since 0.2.2
 */
class LimitDatabase extends BaseDatabase {
    private async getItems(): Promise<Items> {
        let items = await this.storage.getOne<Items>(KEY) || {}
        return items
    }

    private update(items: Items): Promise<void> {
        const days10Ago = new Date(Date.now() - MILL_PER_DAY * 10)
        const days10AgoStr = formatTimeYMD(days10Ago)
        // Clear early date
        Object.values(items).forEach(item => {
            const records = item.r
            if (!records) return
            const keys2Del = Object.keys(records).filter(k => k <= days10AgoStr)
            keys2Del.forEach(k => delete records[k])
        })
        return this.setByKey(KEY, items)
    }

    async all(): Promise<LimitRecord[]> {
        const items = await this.getItems()
        return Object.values(items).map(cvtItem2Rec)
    }

    async save(data: MakeOptional<timer.limit.Rule, 'id'>, rewrite?: boolean): Promise<number> {
        const items = await this.getItems()
        let {
            id, name, weekdays,
            enabled, allowDelay,
            cond,
            time, count,
            weekly, weeklyCount,
            visitTime, periods,
        } = data
        if (!id) {
            const lastId = Object.values(items)
                .map(e => e.i)
                .filter(i => !!i)
                .sort((a, b) => b - a)?.[0] ?? 0
            id = lastId + 1
        }
        const existItem = items[id]
        if (existItem && !rewrite) return id
        items[id] = {
            // Can be overridden by existing
            ...(existItem || {}),
            i: id, n: name, c: cond, wd: weekdays,
            e: !!enabled, ad: !!allowDelay,
            t: time, ct: count,
            wt: weekly, wct: weeklyCount,
            v: visitTime, p: periods,
        }
        await this.update(items)
        return id
    }

    async remove(id: number): Promise<void> {
        const items = await this.getItems()
        delete items[id]
        await this.update(items)
    }

    async updateWaste(date: string, toUpdate: { [id: number]: number }): Promise<void> {
        const items = await this.getItems()
        Object.entries(toUpdate).forEach(([k, waste]) => {
            const id = parseInt(k)
            const entry = items[id]
            if (!entry) return
            const records = entry.r = entry.r || {}
            const record = records[date] = records[date] || { m: 0, c: 0 }
            record.m = waste
        })
        await this.update(items)
    }

    async increaseVisit(date: string, ids: number[]) {
        const items = await this.getItems()
        ids?.forEach(id => {
            const entry = items[id]
            if (!entry) return
            const records = entry.r = entry.r || {}
            const record = records[date] = records[date] || { m: 0, c: 0 }
            record.c++
        })
        await this.update(items)
    }

    async updateDelayCount(date: string, toUpdate: timer.limit.Item[]): Promise<void> {
        const items = await this.getItems()
        toUpdate?.forEach(({ id, delayCount }) => {
            const entry = items[id]
            if (!entry) return
            const records = entry.r = entry.r || {}
            const record = records[date] = records[date] || { m: 0, c: 0 }
            record.d = delayCount
        })
        await this.update(items)
    }

    async updateDelay(id: number, allowDelay: boolean) {
        const items = await this.getItems()
        if (!items[id]) return
        items[id].ad = allowDelay
        await this.update(items)
    }

    async updateEnabled(id: number, enabled: boolean) {
        const items = await this.getItems()
        if (!items[id]) return
        items[id].e = !!enabled
        await this.update(items)
    }

    async importData(data: any): Promise<void> {
        let toImport = data[KEY] as Items
        // Not import
        if (typeof toImport !== 'object') return
        const exists: Items = await this.getItems()
        migrate(exists, toImport)
        this.setByKey(KEY, exists)
    }
}

export default LimitDatabase
