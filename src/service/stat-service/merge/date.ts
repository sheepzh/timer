import { identifySiteKey } from "@util/site"
import { mergeResult } from "./common"

export function mergeDate(origin: timer.stat.Row[]): timer.stat.Row[] {
    const map: Record<string, timer.stat.Row> = {}
    origin.forEach(ele => {
        const { date, siteKey, cateKey, iconUrl, alias, cateId } = ele || {}
        const key = [identifySiteKey(siteKey), cateKey?.toString?.() ?? ''].join('_')
        let exist = map[key]
        if (!exist) {
            exist = map[key] = {
                siteKey, cateKey,
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
        exist.mergedDates.push(date)
    })
    const newRows = Object.values(map)
    return newRows
}