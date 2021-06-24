import FocusPerDay from "../entity/dao/period-info"
import PeriodInfo, { PeriodKey } from "../entity/dto/period-info"
import BaseDatabase from "./common/base-database"
import { REMAIN_WORD_PREFIX } from "./common/constant"

const KEY_PREFIX = REMAIN_WORD_PREFIX + 'PERIOD'
const KEY_PREFIX_LENGTH = KEY_PREFIX.length
const generateKey = (date: string) => KEY_PREFIX + date

function merge(exists: { [dateKey: string]: FocusPerDay }, toMerge: PeriodInfo[]) {
    toMerge.forEach(period => {
        const { order, millseconds } = period
        const key = generateKey(period.getDateString())
        const exist = exists[key] || {}
        const previous = exist[order] || 0
        exist[order] = previous + millseconds
        exists[key] = exist
    })
}

function db2PeriodInfos(data: { [dateKey: string]: FocusPerDay }): PeriodInfo[] {
    const result: PeriodInfo[] = []
    Object.entries(data).forEach((([dateKey, val]) => {
        const dateStr = dateKey.substr(KEY_PREFIX_LENGTH)
        const date = new Date(
            Number.parseInt(dateStr.substr(0, 4)),
            Number.parseInt(dateStr.substr(4, 2)) - 1,
            Number.parseInt(dateStr.substr(6, 2))
        )
        Object
            .entries(val)
            .forEach(([order, millseconds]) => result.push(PeriodKey.of(date, Number.parseInt(order)).produce(millseconds)))
    }))
    return result
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
        const dates = Array.from(new Set(items.map(item => item.getDateString())))
        const exists = await this.getBatch0(dates)
        merge(exists, items)
        this.updateBatch(exists)
        return Promise.resolve()
    }

    private updateBatch(data: { [dateKey: string]: FocusPerDay }): Promise<void> {
        return this.storage.set(data)
    }

    /**
     * Used by self
     */
    private getBatch0(dates: string[]): Promise<{ [dateKey: string]: FocusPerDay }> {
        const keys = dates.map(generateKey)
        return this.storage.get(keys)
    }

    public async getBatch(dates: string[]): Promise<PeriodInfo[]> {
        return db2PeriodInfos(await this.getBatch0(dates))
    }
}

export default PeriodDatabase