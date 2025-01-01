import weekHelper from "@service/components/week-helper"
import optionService from "@service/option-service"
import statService, { type StatQueryParam } from "@service/stat-service"
import { getDayLength, getMonthTime, MILL_PER_DAY } from "@util/time"
import { type PopupQuery, type PopupResult, type PopupRow } from "./common"
import { t } from "./locale"

type DateRangeCalculator = (now: Date, num?: number) => Promise<Date | [Date, Date]> | Date | [Date, Date]

const DATE_RANGE_CALCULATORS: { [duration in timer.option.PopupDuration]: DateRangeCalculator } = {
    today: now => now,
    yesterday: now => new Date(now.getTime() - MILL_PER_DAY),
    thisWeek: async now => {
        const [start] = await weekHelper.getWeekDate(now)
        return [start, now]
    },
    thisMonth: now => [getMonthTime(now)[0], now],
    lastDays: (now, num) => [new Date(now.getTime() - MILL_PER_DAY * (num - 1)), now],
    allTime: () => null,
}

export const doQuery = async (param: PopupQuery) => {
    const option = await optionService.getAllOption()
    const itemCount = option.popupMax
    const statQuery = await cvt2StatQuery(param)
    const rows = await statService.select(statQuery, true)
    const popupRows: PopupRow[] = []
    const other = otherPopupRow()
    let otherCount = 0
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        if (i < itemCount) {
            popupRows.push(row)
        } else {
            other.focus += row.focus
            otherCount++
        }
    }
    other.host = t(msg => msg.chart.otherLabel, { count: otherCount })
    popupRows.push(other)
    const type = statQuery.sort as timer.stat.Dimension
    const data = popupRows.filter(item => item[type])
    const date = statQuery.date
    let mixDate: string, maxDate: string
    rows.flatMap(r => r.mergedDates || []).map(d => {
        if (!mixDate || d < mixDate) mixDate = d
        if (!maxDate || d > maxDate) maxDate = d
    })

    return {
        query: param,
        date,
        displaySiteName: option.displaySiteName,
        data,
        dataDate: [mixDate, maxDate],
        dateLength: date instanceof Array ? getDayLength(date[0], date[1]) : 1,
        chartTitle: t(msg => msg.chart.title[param.duration], { n: param.durationNum }),
    } satisfies PopupResult
}

const cvt2StatQuery = async (param: PopupQuery): Promise<StatQueryParam> => {
    const { duration, durationNum, mergeHost, type } = param
    const stat: StatQueryParam = {
        date: await DATE_RANGE_CALCULATORS[duration]?.(new Date(), durationNum),
        mergeHost,
        sort: type,
        sortOrder: 'DESC',
        mergeDate: true,
        exclusiveVirtual: true,
    }
    return stat
}

const otherPopupRow = (): PopupRow => ({
    host: t(msg => msg.chart.otherLabel, { count: 0 }),
    focus: 0,
    date: '0000-00-00',
    time: 0,
    mergedHosts: [],
    isOther: true,
    virtual: false,
})