import { CATE_NOT_SET_ID } from "@util/site"
import { mergeResult } from "./common"

export async function mergeCate(origin: timer.stat.Row[]): Promise<timer.stat.Row[]> {
    const rowMap: Record<string, timer.stat.Row> = {}
    origin?.forEach(ele => {
        let { siteKey, date, cateId } = ele || {}
        if (siteKey?.type !== 'normal') return

        cateId = cateId ?? CATE_NOT_SET_ID
        const key = (date ?? '') + cateId.toString()
        let exist = rowMap[key]
        if (!exist) {
            exist = rowMap[key] = {
                cateKey: cateId, date,
                focus: 0,
                time: 0,
                mergedRows: [],
                composition: { focus: [], time: [], run: [] },
            } satisfies timer.stat.Row
        }
        mergeResult(exist, ele)
        exist.mergedRows.push(ele)
    })
    return Object.values(rowMap)
}