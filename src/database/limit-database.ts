/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import BaseDatabase from "./common/base-database"
import { REMAIN_WORD_PREFIX } from "./common/constant"

const KEY = REMAIN_WORD_PREFIX + 'LIMIT'

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
    t: number
    /**
     * Limited time per visit, second
     */
    v?: number
    /**
     * Forbidden periods
     */
    p?: [number, number][]
    /**
     * Enabled flag
     */
    e: boolean
    /**
     * Latest date
     */
    d: string
    /**
     * Wasted time, milliseconds
     */
    w: number
    /**
     * Allow to delay
     * @since 0.4.0
     */
    ad: boolean
}

type Items = Record<number, ItemValue>

function migrate(exist: Items, toMigrate: any) {
    const idBase = Object.keys(exist).map(parseInt).sort().reverse()?.[0] ?? 0 + 1
    Object.values(toMigrate).forEach((value, idx) => {
        const id = idBase + idx
        const itemValue: ItemValue = value as ItemValue
        const { c, n, t, e, ad, d, w, v, p } = itemValue
        exist[id] = { i: id, c, n, t, e: !!e, ad: !!ad, d, w: w || 0, v, p }
    })
}

const compatibleOldItems = (items: Items): Items => {
    const newItems: Items = {}
    Object.entries(items).forEach(([c, v], idx) => {
        const oldVal = v as Omit<ItemValue, 'i' | 'c' | 'n'>
        const id = idx + 1
        const newVal = { i: id, c: [c], n: 'Unnamed', ...oldVal } satisfies ItemValue
        newItems[id] = newVal
    })
    return newItems
}

/**
 * Time limit
 *
 * @since 0.2.2
 */
class LimitDatabase extends BaseDatabase {
    private async getItems(): Promise<Items> {
        let items = await this.storage.getOne<Items>(KEY) || {}
        const isNew = Object.values(items).some(iv => !!iv.i)
        if (!isNew) {
            items = compatibleOldItems(items)
            this.storage.put(KEY, items)
        }
        return items
    }

    private update(items: Items): Promise<void> {
        return this.setByKey(KEY, items)
    }

    async all(): Promise<timer.limit.Record[]> {
        const items = await this.getItems()
        return Object.values(items).map(({ i, n, c, t, v, p, e, ad, w, d }) => ({
            id: i,
            name: n,
            cond: c,
            time: t,
            visitTime: v,
            periods: p,
            enabled: e,
            allowDelay: !!ad,
            wasteTime: w,
            latestDate: d,
        }))
    }

    async save(data: timer.limit.Rule, rewrite?: boolean): Promise<number> {
        const items = await this.getItems()
        let { id, name, cond, time, enabled, allowDelay, visitTime, periods } = data
        if (!id) {
            const lastId = Object.values(items).map(e => e.i).filter(i => !!i).sort().reverse()?.[0] ?? 0
            id = lastId + 1
        }
        const existItem = items[id]
        if (existItem && !rewrite) return id
        items[id] = {
            // Can be overridden by existing
            d: '', w: 0,
            ...(existItem || {}),
            i: id, n: name, c: cond, t: time, e: enabled, ad: allowDelay, v: visitTime, p: periods,
        }
        await this.update(items)
        return id
    }

    async remove(id: number): Promise<void> {
        const items = await this.getItems()
        delete items[id]
        this.update(items)
    }

    async updateWaste(date: string, toUpdate: { [id: number]: number }): Promise<void> {
        const items = await this.getItems()
        Object.entries(toUpdate).forEach(([id, waste]) => {
            const entry = items[id]
            if (!entry) return
            entry.d = date
            entry.w = waste
        })
        this.update(items)
    }

    async updateDelay(id: number, allowDelay: boolean) {
        const items = await this.getItems()
        if (!items[id]) return
        items[id].ad = allowDelay
        await this.update(items)
    }

    async importData(data: any): Promise<void> {
        let toImport = data[KEY] as Items
        // Not import
        if (typeof toImport !== 'object') return
        const isNew = Object.values(toImport).some(e => !!e.i)
        !isNew && (toImport = compatibleOldItems(toImport))
        const exists: Items = await this.getItems()
        migrate(exists, toImport)
        this.setByKey(KEY, exists)
    }
}

export default LimitDatabase