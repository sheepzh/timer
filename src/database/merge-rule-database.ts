/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

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
        const result = await this.storage.getOne<MergeRuleSet>(DB_KEY)
        return result || {}
    }

    private update(data: MergeRuleSet): Promise<void> {
        return this.setByKey(DB_KEY, data)
    }

    async selectAll(): Promise<timer.merge.Rule[]> {
        const set = await this.refresh()
        return Object.entries(set)
            .map(([origin, merged]) => ({ origin, merged } satisfies timer.merge.Rule))
    }

    async remove(origin: string): Promise<void> {
        const set = await this.refresh()
        delete set[origin]
        await this.update(set)
    }

    /**
     * Add to the db
     */
    async add(...toAdd: timer.merge.Rule[]): Promise<void> {
        const set = await this.refresh()
        // Not rewrite
        toAdd.forEach(({ origin, merged }) => set[origin] = set[origin] ?? merged)
        await this.update(set)
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

const mergeRuleDatabase = new MergeRuleDatabase()

export default mergeRuleDatabase