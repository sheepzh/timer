/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { formatTimeYMD } from "@util/time"
import { periodFormatter } from "@app/util/time"
import {
    exportCsv as exportCsv_,
    exportJson as exportJson_,
} from "@util/file"

type _ExportInfo = {
    host: string
    alias?: string
    date?: string
    focus?: string
    time?: number
}

/**
 * Compute the name of downloaded file
 */
function computeFileName(filterParam: ReportFilterOption): string {
    let baseName = t(msg => msg.report.exportFileName)
    const { dateRange, mergeDate, mergeHost, timeFormat } = filterParam
    if (dateRange && dateRange.length === 2) {
        const start = dateRange[0]
        const end = dateRange[1]
        baseName += '_' + formatTimeYMD(start)
        baseName += '_' + formatTimeYMD(end)
    }
    mergeDate && (baseName += '_' + t(msg => msg.report.mergeDate))
    mergeHost && (baseName += '_' + t(msg => msg.report.mergeDomain))
    timeFormat && (baseName += '_' + t(msg => msg.timeFormat[timeFormat]))
    return baseName
}

const generateJsonData = (rows: timer.stat.Row[]) => rows.map(row => {
    const data: _ExportInfo = { host: row.host }
    data.date = row.date
    data.alias = row.alias
    // Always display by seconds
    data.focus = periodFormatter(row.focus, { format: 'second', hideUnit: true })
    data.time = row.time
    return data
})

/**
 * Export json data
 *
 * @param filterParam filter params
 * @param rows row data
 */
export function exportJson(filterParam: ReportFilterOption, rows: timer.stat.Row[]): void {
    const fileName = computeFileName(filterParam)
    const jsonData = generateJsonData(rows)
    exportJson_(jsonData, fileName)
}

function generateCsvData(rows: timer.stat.Row[], filterParam: ReportFilterOption): string[][] {
    const { mergeDate, mergeHost } = filterParam
    const columnName: string[] = []
    if (!mergeDate) {
        columnName.push(t(msg => msg.item.date))
    }
    columnName.push(t(msg => msg.item.host))
    if (!mergeHost) {
        columnName.push(t(msg => msg.siteManage.column.alias))
    }
    columnName.push(t(msg => msg.item.focus))
    columnName.push(t(msg => msg.item.time))
    const data = [columnName]
    rows.forEach(row => {
        const line = []
        if (!mergeDate) {
            line.push(row.date)
        }
        line.push(row.host)
        if (!mergeHost) {
            line.push(row.alias || '')
        }
        line.push(periodFormatter(row.focus, { format: 'second', hideUnit: true }))
        line.push(row.time)
        data.push(line)
    })
    return data
}

/**
 * Export csv data
 *
 * @param filterParam filter params
 * @param rows row data
 */
export function exportCsv(filterParam: ReportFilterOption, rows: timer.stat.Row[]): void {
    const fileName = computeFileName(filterParam)
    const csvData = generateCsvData(rows, filterParam)
    exportCsv_(csvData, fileName)
}