import { cvt2StatQuery, type PopupQuery } from "@popup/common"
import optionHolder from "@service/components/option-holder"
import statService from "@service/stat-service"
import { sum } from "@util/array"

export type RankingResult = {
    rows: timer.stat.Row[]
    max: number
    total: number
    displaySiteName: boolean
    date: Date | [Date, Date?] | undefined
}

export const doQuery = async (query: PopupQuery): Promise<RankingResult> => {
    const statQuery = await cvt2StatQuery(query)
    const rows = await statService.select(statQuery, true)
    const { type } = query || {}
    const values = rows?.map(r => r?.[type] ?? 0) ?? []
    const max = values.sort((a, b) => (b ?? 0) - (a ?? 0))[0] ?? 0
    const total = sum(values)
    const date = statQuery.date
    const { displaySiteName } = await optionHolder.get() || {}
    return { max, total, rows, date, displaySiteName }
}