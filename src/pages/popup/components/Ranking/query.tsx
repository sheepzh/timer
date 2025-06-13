import { queryRows } from "@popup/common"
import { type PopupQuery } from "@popup/context"
import optionHolder from "@service/components/option-holder"
import { sum } from "@util/array"

export type RankingResult = {
    rows: timer.stat.Row[]
    max: number
    total: number
    displaySiteName: boolean
    date: Date | [Date, Date?] | undefined
}

export const doQuery = async (query: PopupQuery): Promise<RankingResult> => {
    const [rows, date] = await queryRows(query)
    const { dimension } = query
    const values = rows?.map(r => r?.[dimension] ?? 0) ?? []
    const max = values.sort((a, b) => (b ?? 0) - (a ?? 0))[0] ?? 0
    const total = sum(values)
    const { displaySiteName } = await optionHolder.get() || {}
    return { max, total, rows, date, displaySiteName }
}