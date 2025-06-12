import { identifyTargetKey, isMergedSite } from "@util/stat"
import { mergeResult } from "./common"

export function mergeDate<T extends timer.stat.Row>(origin: T[]): T[] {
    const map: Record<string, MakeRequired<timer.stat.Row, 'mergedDates' | 'mergedRows'>> = {}
    origin.forEach(ele => {
        const { date } = ele
        const key = identifyTargetKey(ele)
        let exist = map[key]
        if (!exist) {
            exist = map[key] = {
                ...ele,
                focus: 0,
                time: 0,
                mergedRows: [],
                mergedDates: [],
                composition: { focus: [], time: [], run: [] },
            } satisfies timer.stat.Row
        }
        mergeResult(exist, ele)
        if (isMergedSite(ele) && isMergedSite(exist)) {
            exist.mergedRows.push(...ele.mergedRows ?? [])
        }
        date && exist.mergedDates.push(date)
    })
    const newRows = Object.values(map)
    return newRows as T[]
}