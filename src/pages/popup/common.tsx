import type { ReportQueryParam } from "@app/components/Report/types"
import { REPORT_ROUTE } from "@app/router/constants"
import weekHelper from "@service/components/week-helper"
import { type StatQueryParam } from "@service/stat-service"
import { isRemainHost } from "@util/constant/remain-host"
import { getAppPageUrl } from "@util/constant/url"
import { getMonthTime, MILL_PER_DAY } from "@util/time"

export type PopupQuery = {
    mergeMethod: timer.stat.MergeMethod | undefined
    duration: timer.option.PopupDuration
    durationNum?: number
    type: timer.core.Dimension
}

type DateRangeCalculator = (now: Date, num?: number) => Awaitable<Date | [Date, Date] | undefined>

const DATE_RANGE_CALCULATORS: { [duration in timer.option.PopupDuration]: DateRangeCalculator } = {
    today: now => now,
    yesterday: now => new Date(now.getTime() - MILL_PER_DAY),
    thisWeek: async now => {
        const [start] = await weekHelper.getWeekDate(now)
        return [start, now]
    },
    thisMonth: now => [getMonthTime(now)[0], now],
    lastDays: (now, num) => [new Date(now.getTime() - MILL_PER_DAY * (num ?? 1 - 1)), now],
    allTime: () => undefined,
}

export const cvt2StatQuery = async (param: PopupQuery): Promise<StatQueryParam> => {
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

function buildReportQuery(siteType: timer.site.Type, date: Date | [Date, Date?] | undefined, type: timer.core.Dimension): ReportQueryParam {
    const query: ReportQueryParam = {}
    // Merge host
    siteType === 'merged' && (query.mh = "1")
    // Date
    query.md = '1'
    if (Array.isArray(date)) {
        if (date.length === 1) {
            query.ds = query.de = date[0]?.getTime?.()?.toString?.()
        } else if (date.length === 2) {
            query.ds = date[0]?.getTime?.()?.toString?.()
            // End is now
            // Not the end of this week/month
            query.de = new Date().getTime().toString()
        }
    } else if (!!date) {
        query.ds = query.de = date.getTime?.()?.toString?.()
    }
    // Sorted column
    query.sc = type
    return query
}

export function calJumpUrl(siteKey: timer.site.SiteKey | undefined, date: Date | [Date, Date?] | undefined, type: timer.core.Dimension): string | undefined {
    if (!siteKey) return
    const { host, type: siteType } = siteKey

    if (siteType === 'normal' && !isRemainHost(host)) {
        return `http://${host}`
    }

    const query = buildReportQuery(siteType, date, type)
    return getAppPageUrl(REPORT_ROUTE, query)
}
