import { identifyStatKey } from "@util/stat"
import { mergeResult } from "./common"

export function mergeDate(origin: timer.stat.Row[]): timer.stat.Row[] {
    const map: Record<string, MakeRequired<timer.stat.Row, 'mergedDates' | 'mergedRows'>> = {}
    origin.forEach(ele => {
        const { date, siteKey, groupKey, cateKey, iconUrl, alias, cateId } = ele || {}
        const key = identifyStatKey(ele)
        let exist = map[key]
        if (!exist) {
            exist = map[key] = {
                siteKey, cateKey, groupKey,
                iconUrl, alias, cateId,
                focus: 0,
                time: 0,
                mergedRows: [],
                mergedDates: [],
                composition: { focus: [], time: [], run: [] },
            }
        }
        mergeResult(exist, ele)
        if (ele.siteKey?.type === 'merged') {
            exist.mergedRows.push(...ele.mergedRows ?? [])
        }
        date && exist.mergedDates.push(date)
    })
    const newRows = Object.values(map)
    return newRows
}