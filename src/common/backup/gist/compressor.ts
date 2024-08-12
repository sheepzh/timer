/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { groupBy } from "@util/array"
import { formatTimeYMD, getBirthday, parseTime } from "@util/time"

function calcGroupKey(row: timer.stat.RowBase): string {
    const date = row.date
    if (!date) {
        return undefined
    }
    return date.substring(0, 6)
}

/**
 * Compress row array to gist row
 *
 * @param rows row array
 */
function compress(rows: timer.stat.RowBase[]): GistData {
    const result: GistData = groupBy(
        rows,
        row => row.date.substring(6),
        groupedRows => {
            const gistRow: GistRow = {}
            groupedRows.forEach(({ host, focus, time }) => gistRow[host] = [time, focus])
            return gistRow
        }
    )
    return result
}

/**
 * Divide rows to buckets
 *
 * @returns [bucket, data][]
 */
export function divide2Buckets(rows: timer.stat.RowBase[]): [string, GistData][] {
    const grouped: { [yearAndPart: string]: GistData } = groupBy(rows.filter(r => !!r), calcGroupKey, compress)
    return Object.entries(grouped)
}

/**
 * Calculate all the buckets between {@param startDate} and {@param endDate}
 */
export function calcAllBuckets(startDate: string, endDate: string) {
    endDate = endDate || formatTimeYMD(new Date())
    const result = []
    const start = startDate ? parseTime(startDate) : getBirthday()
    const end = parseTime(endDate)
    while (start < end) {
        result.push(formatTimeYMD(start))
        start.setMonth(start.getMonth() + 1)
    }
    const lastMonth = formatTimeYMD(end)
    !result.includes(lastMonth) && (result.push(lastMonth))
    return result
}

/**
 * Gist data 2 rows
 *
 * @param filename yearMonth
 * @param gistData gistData
 * @returns rows
 */
export function gistData2Rows(yearMonth: string, gistData: GistData): timer.stat.RowBase[] {
    const result = []
    Object.entries(gistData).forEach(([dateOfMonth, gistRow]) => {
        const date = yearMonth + dateOfMonth
        Object.entries(gistRow).forEach(([host, val]) => {
            const [time, focus] = val
            const row: timer.stat.RowBase = {
                date,
                host,
                time,
                focus
            }
            result.push(row)
        })
    })
    return result
}