import MergeRuleDatabase from "@db/merge-rule-database"
import CustomizedHostMergeRuler from "@service/components/host-merge-ruler"
import { mergeResult } from "./common"

const mergeRuleDatabase = new MergeRuleDatabase(chrome.storage.local)

export async function mergeHost(origin: timer.stat.Row[]): Promise<timer.stat.Row[]> {
    const map: Record<string, timer.stat.Row> = {}

    // Generate ruler
    const mergeRuleItems: timer.merge.Rule[] = await mergeRuleDatabase.selectAll()
    const mergeRuler = new CustomizedHostMergeRuler(mergeRuleItems)

    origin.forEach(ele => {
        const { siteKey, date } = ele || {}
        const { host, type } = siteKey || {}
        if (type !== 'normal') return
        let mergedHost = mergeRuler.merge(host)
        const key = (date ?? '') + mergedHost
        let exist = map[key]
        if (!exist) {
            exist = map[key] = {
                siteKey: { type: 'merged', host: mergedHost },
                date,
                focus: 0,
                time: 0,
                mergedRows: [],
                composition: { focus: [], time: [], run: [] },
            } satisfies timer.stat.Row
        }
        mergeResult(exist, ele)
        exist.mergedRows.push(ele)
    })
    return Object.values(map)
}