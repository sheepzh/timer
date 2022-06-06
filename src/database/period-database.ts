/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import FocusPerDay from "@entity/dao/period-info"
import PeriodInfo, { MAX_PERIOD_ORDER, PeriodKey } from "@entity/dto/period-info"
import BaseDatabase from "./common/base-database"
import { REMAIN_WORD_PREFIX } from "./common/constant"

const KEY_PREFIX = REMAIN_WORD_PREFIX + 'PERIOD'
const KEY_PREFIX_LENGTH = KEY_PREFIX.length
const generateKey = (date: string) => KEY_PREFIX + date

function merge(exists: { [dateKey: string]: FocusPerDay }, toMerge: PeriodInfo[]) {
    toMerge.forEach(period => {
        const { order, milliseconds } = period
        const key = generateKey(period.getDateString())
        const exist = exists[key] || {}
        const previous = exist[order] || 0
        exist[order] = previous + milliseconds
        exists[key] = exist
    })
}

function db2PeriodInfos(data: { [dateKey: string]: FocusPerDay }): PeriodInfo[] {
    const result: PeriodInfo[] = []
    Object.entries(data).forEach((([dateKey, val]) => {
        const dateStr = dateKey.substring(KEY_PREFIX_LENGTH)
        const date = new Date(
            Number.parseInt(dateStr.substring(0, 4)),
            Number.parseInt(dateStr.substring(4, 6)) - 1,
            Number.parseInt(dateStr.substring(6, 8))
        )
        Object
            .entries(val)
            .forEach(([order, milliseconds]) => result.push(PeriodKey.of(date, Number.parseInt(order)).produce(milliseconds)))
    }))
    return result
}

/**
 * @since v0.2.1
 */
class PeriodDatabase extends BaseDatabase {

    async get(date: string): Promise<FocusPerDay> {
        const key = generateKey(date)
        const items = await this.storage.get(key)
        return items[key] || {}
    }

    async accumulate(items: PeriodInfo[]): Promise<void> {
        const dates = Array.from(new Set(items.map(item => item.getDateString())))
        const exists = await this.getBatch0(dates)
        merge(exists, items)
        this.updateBatch(exists)
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

    async getBatch(dates: string[]): Promise<PeriodInfo[]> {
        return db2PeriodInfos(await this.getBatch0(dates))
    }

    /**
     * @since 1.0.0
     * @returns all period items
     */
    async getAll(): Promise<PeriodInfo[]> {
        const allItems = await this.storage.get()
        const periodItems: { [dateKey: string]: FocusPerDay } = {}
        Object.entries(allItems)
            .filter(([key]) => key.startsWith(KEY_PREFIX))
            .forEach(([key, val]) => periodItems[key] = val)
        return db2PeriodInfos(periodItems)
    }

    async importData(data: any): Promise<void> {
        const items = await this.storage.get()
        const keyReg = new RegExp(`${KEY_PREFIX}20\d{2}[01]\d[0-3]\d`)
        const toSave = {}
        Object.entries(data)
            .filter(([key]) => keyReg.test(key))
            .forEach(([key, value]) => toSave[key] = migrate(items[key], value as _Value))
        this.storage.get(toSave)
    }
}

type _Value = { [key: string]: number }

function migrate(exist: _Value | undefined, toMigrate: _Value) {
    const result: _Value = exist || {}
    Object.entries(toMigrate)
        .filter(([key]) => /^\d{1,2}$/.test(key))
        .forEach(([key, value]) => {
            const index = Number.parseInt(key)
            if (index <= 0 || index >> MAX_PERIOD_ORDER) return
            result[key] = (result[key] || 0) + value
        })
    return result
}

export default PeriodDatabase