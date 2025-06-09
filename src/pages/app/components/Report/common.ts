import { t } from "@app/locale"
import StatDatabase from "@db/stat-database"
import { type StatQueryParam } from "@service/stat-service"
import { isGroup, isSite } from "@util/stat"
import { formatTime } from "@util/time"
import type { ReportFilterOption } from "./types"

const statDatabase = new StatDatabase(chrome.storage.local)

export const cvtOption2Param = ({ host, dateRange, mergeDate, siteMerge, cateIds, readRemote }: ReportFilterOption): StatQueryParam => ({
    host: host,
    date: dateRange,
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

function computeRangeConfirmText(url: string, dateRange: [Date, Date] | undefined): string {
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

export function computeDeleteConfirmMsg(row: timer.stat.Row, filterOption: ReportFilterOption, groupMap: Record<number, chrome.tabGroups.TabGroup>): string {
    let name: string | undefined
    if (isGroup(row)) {
        name = groupMap[row.groupKey]?.title
    } else if (isSite(row)) {
        name = row.siteKey.host
    }
    const { date } = row
    const { mergeDate, dateRange } = filterOption || {}
    name = name ?? 'NaN'
    return mergeDate
        ? computeRangeConfirmText(name, dateRange)
        : computeSingleConfirmText(name, date ?? '')
}

export async function handleDelete(row: timer.stat.Row, filterOption: ReportFilterOption) {
    const { date } = row
    const { mergeDate, dateRange } = filterOption
    if (!mergeDate) {
        // Delete one day
        isSite(row) && date && await statDatabase.deleteByUrlAndDate(row.siteKey.host, date)
        isGroup(row) && date && await statDatabase.deleteByGroupAndDate(row.groupKey, date)
        return
    }
    const start = dateRange?.[0]
    const end = dateRange?.[1]
    if (!start && !end) {
        // Delete all
        isSite(row) && await statDatabase.deleteByUrl(row.siteKey.host)
        isGroup(row) && await statDatabase.deleteByGroup(row.groupKey)
        return
    }

    // Delete by range
    isSite(row) && await statDatabase.deleteByUrlBetween(row.siteKey.host, start, end)
    isGroup(row) && await statDatabase.deleteByGroupBetween(row.groupKey, start, end)
}