import TimeLimit from "../entity/dao/time-limit"
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

    async all(): Promise<TimeLimit[]> {
        const items = await this.getItems()
        return Object.entries(items).map(([cond, info]) => {
            const item: ItemValue = info as ItemValue
            return { cond, time: item.t, enabled: item.e }
        })
    }

    async add(data: TimeLimit): Promise<void> {
        const items = await this.getItems()
        // Not rewrite
        if (items[data.cond]) return
        items[data.cond] = { t: data.time, e: data.enabled }
        this.update(items)
    }

    async remove(cond: string): Promise<void> {
        const items = await this.getItems()
        delete items[cond]
        this.update(items)
    }
}

export default LimitDatabase