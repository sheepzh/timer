import FocusPerDay from "../entity/dao/period-info"
import PeriodInfo from "../entity/dto/period-info"
import BaseDatabase from "./common/base-database"
import { REMAIN_WORD_PREFIX } from "./common/constant"

const KEY_PREFIX = REMAIN_WORD_PREFIX + 'PERIOD'
const generateKey = (date: string) => KEY_PREFIX + date

function merge(exists: { [dateKey: string]: FocusPerDay }, toMerge: PeriodInfo[]) {
    toMerge.forEach(({ date, minuteOrder, millseconds }) => {
        const key = generateKey(date)
        const exist = exists[key] || {}
        const previous = exist[minuteOrder] || 0
        exist[minuteOrder] = previous + millseconds
        exists[key] = exist
    })
}

/**
 * @since v0.2.1
 */
class PeriodDatabase extends BaseDatabase {

    public async get(date: string): Promise<FocusPerDay> {
        const key = generateKey(date)
        const items = await this.storage.get(key)
        return items[key] || {}
    }

    /**
     * @param date date
     * @param minuteOrder minuteOrder  
     * @param millseconds millseconds to accumulate
     */
    public async accumulate(items: PeriodInfo[]): Promise<void> {
        const dates = Array.from(new Set(items.map(item => item.date)))
        const exists = await this.getBatch(dates)
        merge(exists, items)
        this.updateBatch(exists)
        return Promise.resolve()
    }

    private updateBatch(data: { [dateKey: string]: FocusPerDay }): Promise<void> {
        return this.storage.set(data)
    }

    private getBatch(dates: string[]): Promise<{ [dateKey: string]: FocusPerDay }> {
        const keys = dates.map(generateKey)
        return this.storage.get(keys)
    }
}

export default PeriodDatabase