import { t } from "@app/locale"
import StatDatabase from "@db/stat-database"
import { type StatQueryParam } from "@service/stat-service"
import { formatTime } from "@util/time"
import { type ReportFilterOption } from "./context"

const statDatabase = new StatDatabase(chrome.storage.local)

export const cvtOption2Param = ({ host, dateRange, mergeDate, siteMerge, cateIds, readRemote }: ReportFilterOption): StatQueryParam => ({
    host: host,
    date: [dateRange?.[0], dateRange?.[1]],
    mergeDate,
    mergeHost: siteMerge === 'domain',
    mergeCate: siteMerge === 'cate',
    inclusiveRemote: readRemote,
    cateIds,
})

/**
 * Compute the confirm text for one item to delete
 *
 * @param url  item url
 * @param date item date
 */
function computeSingleConfirmText(url: string, date: string): string {
    return t(msg => msg.item.operation.deleteConfirmMsg, { url, date })
}

function computeRangeConfirmText(url: string, dateRange: [Date, Date]): string {
    const hasDateRange = dateRange?.length === 2 && (dateRange[0] || dateRange[1])
    if (!hasDateRange) {
        // Delete all
        return t(msg => msg.item.operation.deleteConfirmMsgAll, { url })
    }
    const dateFormat = t(msg => msg.calendar.dateFormat)
    const startDate = dateRange[0]
    const endDate = dateRange[1]
    const start = formatTime(startDate, dateFormat)
    const end = formatTime(endDate, dateFormat)
    return start === end
        // Only one day
        ? computeSingleConfirmText(url, start)
        : t(msg => msg.item.operation.deleteConfirmMsgRange, { url, start, end })
}

export function computeDeleteConfirmMsg(row: timer.stat.Row, filterOption: ReportFilterOption): string {
    const { siteKey, date } = row || {}
    const { host } = siteKey || {}
    const { mergeDate, dateRange } = filterOption || {}
    return mergeDate
        ? computeRangeConfirmText(host, dateRange)
        : computeSingleConfirmText(host, date)
}

export async function handleDelete(row: timer.stat.Row, filterOption: ReportFilterOption) {
    const { siteKey, date } = row || {}
    const { host } = siteKey || {}
    const { mergeDate, dateRange } = filterOption || {}
    if (!mergeDate) {
        // Delete one day
        await statDatabase.deleteByUrlAndDate(host, date)
        return
    }
    const start = dateRange?.[0]
    const end = dateRange?.[1]
    if (!start && !end) {
        // Delete all
        await statDatabase.deleteByUrl(host)
        return
    }

    // Delete by range
    await statDatabase.deleteByUrlBetween(host, start, end)
}