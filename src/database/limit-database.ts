import { TimeLimit, TimeLimitInfo } from "../entity/dao/time-limit"
import BaseDatabase from "./common/base-database"
import { REMAIN_WORD_PREFIX } from "./common/constant"

const KEY = REMAIN_WORD_PREFIX + 'LIMIT'

type ItemValue = {
    /**
        * Limitted time, second
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
     * Wasted time, millseconds
     */
    w: number
}

type Item = {
    [cond: string]: ItemValue
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

    async all(): Promise<TimeLimitInfo[]> {
        const items = await this.getItems()
        return Object.entries(items).map(([cond, info]) => {
            const item: ItemValue = info as ItemValue
            return { cond, time: item.t, enabled: item.e, wasteTime: item.w, latestDate: item.d } as TimeLimitInfo
        })
    }

    async save(data: TimeLimit, rewrite?: boolean): Promise<void> {
        const items = await this.getItems()
        if (!rewrite && items[data.cond]) {
            // Not rewrite
            return
        }
        items[data.cond] = { t: data.time, e: data.enabled, w: 0, d: '' }
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
}

export default LimitDatabase