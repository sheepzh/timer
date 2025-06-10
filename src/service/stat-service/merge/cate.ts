import { CATE_NOT_SET_ID } from "@util/site"
import { isNormalSite } from "@util/stat"
import { mergeResult } from "./common"

export async function mergeCate(origin: timer.stat.SiteRow[]): Promise<timer.stat.Row[]> {
    const rowMap: Record<string, MakeRequired<timer.stat.Row, 'mergedRows'>> = {}
    origin?.forEach(ele => {
        if (!isNormalSite(ele)) return
        let { date, cateId } = ele || {}

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