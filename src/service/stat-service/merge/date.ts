import { identifyTargetKey } from "@util/stat"
import { mergeResult } from "./common"

function isSiteMerged(row: timer.stat.Row): boolean {
    if (!('siteKey' in row)) return false
    return row.siteKey.type === 'merged'
}

export function mergeDate(origin: timer.stat.Row[]): timer.stat.Row[] {
    const map: Record<string, MakeRequired<timer.stat.Row, 'mergedDates' | 'mergedRows'>> = {}
    origin.forEach(ele => {
        const { date, iconUrl, alias, cateId } = ele || {}
        const key = identifyTargetKey(ele)
        let exist = map[key]
        if (!exist) {
            exist = map[key] = {
                ...ele,
                iconUrl, alias, cateId,
                focus: 0,
                time: 0,
                mergedRows: [],
                mergedDates: [],
                composition: { focus: [], time: [], run: [] },
            } satisfies timer.stat.Row
        }
        mergeResult(exist, ele)
        if (isSiteMerged(ele)) {
            exist.mergedRows.push(...ele.mergedRows ?? [])
        }
        date && exist.mergedDates.push(date)
    })
    const newRows = Object.values(map)
    return newRows
}