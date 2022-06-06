/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import HostMergeRuleItem from "@entity/dto/host-merge-rule-item"
import BaseDatabase from "./common/base-database"
import { REMAIN_WORD_PREFIX } from "./common/constant"

const DB_KEY = REMAIN_WORD_PREFIX + 'MERGE_RULES'

type MergeRuleSet = { [key: string]: string | number }

/**
 * Rules to merge host
 *
 * @since 0.1.2
 */
class MergeRuleDatabase extends BaseDatabase {

    async refresh(): Promise<MergeRuleSet> {
        const result = await this.storage.get(DB_KEY)
        const rules = result[DB_KEY] || {}
        return Promise.resolve(rules)
    }

    private async update(data: MergeRuleSet): Promise<void> {
        const toUpdate = {}
        toUpdate[DB_KEY] = data
        return this.storage.set(toUpdate)
    }

    async selectAll(): Promise<HostMergeRuleItem[]> {
        const set: MergeRuleSet = await this.refresh()
        const result: HostMergeRuleItem[] = []
        for (const [key, value] of Object.entries(set)) {
            result.push({ origin: key, merged: value })
        }
        return Promise.resolve(result)
    }

    async remove(origin: string): Promise<void> {
        const set = await this.refresh()
        delete set[origin]
        return this.update(set)
    }

    /**
     * Add to the db
     * 
     * @param toAdd 
     */
    async add(...toAdd: HostMergeRuleItem[]): Promise<void> {
        const set = await this.refresh()
        // Not rewrite
        toAdd.forEach(item => set[item.origin] === undefined && (set[item.origin] = item.merged))
        return this.update(set)
    }

    async importData(data: any): Promise<void> {
        const toMigrate = data?.[DB_KEY]
        if (!toMigrate) return
        const exist = await this.refresh()
        const valueTypes = ['string', 'number']
        Object.entries(toMigrate as MergeRuleSet)
            .filter(([_key, value]) => valueTypes.includes(typeof value))
            // Not rewrite
            .filter(([key]) => !exist[key])
            .forEach(([key, value]) => exist[key] = value)
        this.update(exist)
    }
}

export default MergeRuleDatabase