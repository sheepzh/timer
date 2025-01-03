import { type PopupQuery, type PopupResult } from "@popup/common"
import { t } from "@popup/locale"
import weekHelper from "@service/components/week-helper"
import optionService from "@service/option-service"
import statService, { type StatQueryParam } from "@service/stat-service"
import { getDayLength, getMonthTime, MILL_PER_DAY } from "@util/time"

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

export const doQuery = async (query: PopupQuery): Promise<PopupResult> => {
    const option = await optionService.getAllOption()
    const itemCount = option.popupMax
    const statQuery = await cvt2StatQuery(query)
    const rows = await statService.select(statQuery, true)
    const date = statQuery.date
    let mixDate: string, maxDate: string
    rows.flatMap(r => r.mergedDates || []).map(d => {
        if (!mixDate || d < mixDate) mixDate = d
        if (!maxDate || d > maxDate) maxDate = d
    })

    return {
        query, rows,
        date, dataDate: [mixDate, maxDate],
        dateLength: date instanceof Array ? getDayLength(date[0], date[1]) : 1,
        displaySiteName: option.displaySiteName,
        chartTitle: t(msg => msg.percentage.title[query?.duration], { n: query?.durationNum }),
        itemCount,
    } satisfies PopupResult
}

const cvt2StatQuery = async (param: PopupQuery): Promise<StatQueryParam> => {
    const { duration, durationNum, mergeMethod, type } = param
    const stat: StatQueryParam = {
        date: await DATE_RANGE_CALCULATORS[duration]?.(new Date(), durationNum),
        mergeHost: mergeMethod === 'domain',
        mergeCate: mergeMethod === 'cate',
        sort: type,
        sortOrder: 'DESC',
        mergeDate: true,
        exclusiveVirtual: true,
    }
    return stat
}
