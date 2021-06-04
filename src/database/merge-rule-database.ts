import DomainMergeRuleItem from "../entity/dto/domain-merge-rule-item"
import { REMAIN_WORD_PREFIX } from "./constant"

const DB_KEY = REMAIN_WORD_PREFIX + 'MERGE_RULES'

type MergeRuleSet = { [key: string]: string | number }

/**
 * Rules to merge domain
 *
 * @since 0.1.2
 */
class MergeRuleDatabase {
    private localStorage = chrome.storage.local

    refresh(): Promise<MergeRuleSet> {
        return new Promise(resolve => {
            this.localStorage.get(DB_KEY, result => {
                const rules = result[DB_KEY] || {}
                resolve(rules)
            })
        })
    }

    private update(data: MergeRuleSet): Promise<void> {
        const toUpdate = {}
        toUpdate[DB_KEY] = data
        return new Promise(resolve => this.localStorage.set(toUpdate, resolve))
    }

    async selectAll(): Promise<DomainMergeRuleItem[]> {
        const set: MergeRuleSet = await this.refresh()
        const result: DomainMergeRuleItem[] = []
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
    async add(...toAdd: DomainMergeRuleItem[]): Promise<void> {
        const set = await this.refresh()
        // Not rewrite
        toAdd.forEach(item => set[item.origin] === undefined && (set[item.origin] = item.merged))
        return this.update(set)
    }
}

export default new MergeRuleDatabase()