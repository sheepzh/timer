/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import BaseDatabase from "./common/base-database"
import { REMAIN_WORD_PREFIX } from "./common/constant"

const KEY = REMAIN_WORD_PREFIX + 'LIMIT'

declare type ItemValue = {
    /**
     * Limited time, second
     */
    t: number
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

declare type Item = {
    [cond: string]: ItemValue
}

function migrate(exist: Item, toMigrate: any) {
    Object.entries(toMigrate).forEach(([cond, value]) => {
        // Not rewrite
        if (exist[cond]) return
        const itemValue: ItemValue = value as ItemValue
        const { t, e, ad, d, w } = itemValue
        exist[cond] = { t: t || 0, e: !!e, ad: !!ad, d, w: w || 0 }
    })
}

/**
 * Time limit 
 * 
 * @since 0.2.2
 */
class LimitDatabase extends BaseDatabase {
    private async getItems(): Promise<Item> {
        const result = await this.storage.get(KEY)
        const items: Item = result[KEY] || {}
        return items
    }

    private update(items: Item): Promise<void> {
        return this.setByKey(KEY, items)
    }

    async all(): Promise<timer.limit.Record[]> {
        const items = await this.getItems()
        return Object.entries(items).map(([cond, info]) => {
            const item: ItemValue = info as ItemValue
            return { cond, time: item.t, enabled: item.e, allowDelay: !!item.ad, wasteTime: item.w, latestDate: item.d } as timer.limit.Record
        })
    }

    async save(data: timer.limit.Rule, rewrite?: boolean): Promise<void> {
        const items = await this.getItems()
        if (!rewrite && items[data.cond]) {
            // Not rewrite
            return
        }
        items[data.cond] = { t: data.time, e: data.enabled, ad: data.allowDelay, w: 0, d: '' }
        this.update(items)
    }

    async remove(cond: string): Promise<void> {
        const items = await this.getItems()
        delete items[cond]
        this.update(items)
    }

    async updateWaste(date: string, toUpdate: { [cond: string]: number }): Promise<void> {
        const items = await this.getItems()
        Object.entries(toUpdate).forEach(([cond, waste]) => {
            const entry = items[cond]
            if (!entry) return
            entry.d = date
            entry.w = waste
        })
        this.update(items)
    }

    async updateDelay(cond: string, allowDelay: boolean) {
        const items = await this.getItems()
        if (!items[cond]) {
            return
        }
        items[cond].ad = allowDelay
        await this.update(items)
    }

    async importData(data: any): Promise<void> {
        const toImport = data[KEY]
        // Not import
        if (typeof toImport !== 'object') return
        const result = await this.storage.get(KEY)
        const exists: Item = result[KEY] || {}
        migrate(exists, toImport)
        this.setByKey(KEY, exists)
    }
}

export default LimitDatabase