import { groupBy } from "@util/array"
import { CATE_NOT_SET_ID } from "@util/site"
import { isNormalSite } from "@util/stat"
import { mergeResult } from "./common"

export function mergeCate(origin: timer.stat.SiteRow[], cates: timer.site.Cate[]): timer.stat.CateRow[] {
    const cateNameMap = groupBy(cates, c => c.id, l => l[0]?.name)
    const rowMap: Record<string, MakeRequired<timer.stat.CateRow, 'mergedRows'>> = {}
    origin?.forEach(ele => {
        if (!isNormalSite(ele)) return
        let { date, cateId } = ele || {}

        cateId = cateId ?? CATE_NOT_SET_ID
        const key = (date ?? '') + cateId.toString()
        let exist = rowMap[key]
        if (!exist) {
            exist = rowMap[key] = {
                cateKey: cateId, date, cateName: cateNameMap[cateId],
                focus: 0,
                time: 0,
                mergedRows: [],
                composition: { focus: [], time: [], run: [] },
            } satisfies timer.stat.CateRow
        }
        mergeResult(exist, ele)
        exist.mergedRows.push(ele)
    })
    return Object.values(rowMap)
}