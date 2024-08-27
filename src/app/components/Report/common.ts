import { t } from "@app/locale"
import { cvt2LocaleTime } from "@app/util/time"
import StatDatabase from "@db/stat-database"
import { formatTime } from "@util/time"
import { ReportFilterOption } from "./context"
import { StatQueryParam } from "@service/stat-service"

const statDatabase = new StatDatabase(chrome.storage.local)

export const cvtOption2Param = (filterOption: ReportFilterOption): StatQueryParam => ({
    host: filterOption.host,
    date: [filterOption.dateRange?.[0], filterOption.dateRange?.[1]],
    mergeHost: filterOption.mergeHost,
    mergeDate: filterOption.mergeDate,
    inclusiveRemote: filterOption.readRemote,
})

/**
 * Compute the confirm text for one item to delete
 *
 * @param url  item url
 * @param date item date
 */
function computeSingleConfirmText(url: string, date: string): string {
    const formatDate = cvt2LocaleTime(date)
    return t(msg => msg.item.operation.deleteConfirmMsg, { url, date: formatDate })
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
    const { host, date } = row || {}
    const { mergeDate, dateRange } = filterOption || {}
    return mergeDate
        ? computeRangeConfirmText(host, dateRange)
        : computeSingleConfirmText(host, date)
}

export async function handleDelete(row: timer.stat.Row, filterOption: ReportFilterOption) {
    const { host, date } = row || {}
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
