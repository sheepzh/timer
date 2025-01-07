/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { type I18nKey, t } from "@app/locale"
import { periodFormatter } from "@app/util/time"
import { CATE_MERGE_PLACEHOLDER_ID } from "@service/stat-service/common"
import {
    exportCsv as exportCsv_,
    exportJson as exportJson_,
} from "@util/file"
import { formatTimeYMD } from "@util/time"
import type { ReportFilterOption } from "./types"

type ExportInfo = {
    date?: string
    host: string
    alias?: string
    cate?: string
    focus?: string
    time?: number
}

/**
 * Compute the name of downloaded file
 */
function computeFileName(filterParam: ReportFilterOption): string {
    let baseName = t(msg => msg.report.exportFileName)
    const { dateRange, siteMerge, mergeDate, timeFormat } = filterParam
    if (dateRange && dateRange.length === 2) {
        const start = dateRange[0]
        const end = dateRange[1]
        baseName += '_' + formatTimeYMD(start)
        baseName += '_' + formatTimeYMD(end)
    }
    mergeDate && (baseName += '_' + t(msg => msg.shared.merge.mergeMethod.date))
    siteMerge && (baseName += '_' + t(msg => msg.shared.merge.mergeMethod[siteMerge]))
    timeFormat && (baseName += '_' + t(msg => msg.timeFormat[timeFormat]))
    return baseName
}

const generateJsonData = (rows: timer.stat.Row[], categories: timer.site.Cate[]) => rows.map(row => ({
    host: row.siteKey?.host,
    date: row.date,
    alias: row.alias,
    cate: getCateName(row, categories),
    focus: periodFormatter(row.focus, { format: 'second', hideUnit: true }),
    time: row.time
} satisfies ExportInfo))

const getCateName = (row: timer.stat.Row, categories: timer.site.Cate[]): string => {
    const cateId = row?.cateId || row?.cateKey
    let cate: string
    if (cateId === CATE_MERGE_PLACEHOLDER_ID) {
        cate = t(msg => msg.shared.cate.notSet)
    } else if (cateId) {
        const current = categories?.find(c => c.id === cateId)
        cate = current?.name
    }
    return cate ?? ''
}

/**
 * Export json data
 *
 * @param filterParam filter params
 * @param rows row data
 */
export function exportJson(filterParam: ReportFilterOption, rows: timer.stat.Row[], categories: timer.site.Cate[]): void {
    const fileName = computeFileName(filterParam)
    const jsonData = generateJsonData(rows, categories)
    exportJson_(jsonData, fileName)
}

type CsvColumn = keyof ExportInfo

type CsvColumnConfig = {
    visible: (mergeDate: boolean, siteMerge: ReportFilterOption['siteMerge']) => boolean
    i18n: I18nKey
    formatter: (row: timer.stat.Row, categories: timer.site.Cate[]) => string
}

const CSV_COLUMN_CONFIGS: Record<CsvColumn, CsvColumnConfig> = {
    date: {
        visible: mergeDate => !mergeDate,
        i18n: msg => msg.item.date,
        formatter: row => row.date,
    },
    host: {
        visible: (_, siteMerge) => siteMerge !== 'cate',
        i18n: msg => msg.item.host,
        formatter: row => row.siteKey?.host ?? '',
    },
    alias: {
        visible: (_, siteMerge) => siteMerge !== 'cate',
        i18n: msg => msg.siteManage.column.alias,
        formatter: row => row?.alias ?? '',
    },
    cate: {
        visible: (_, siteMerge) => siteMerge !== 'domain',
        i18n: msg => msg.siteManage.column.cate,
        formatter: (row, categories) => getCateName(row, categories),
    },
    focus: {
        visible: () => true,
        i18n: msg => msg.item.focus,
        formatter: row => periodFormatter(row.focus, { format: 'second', hideUnit: true }),
    },
    time: {
        visible: () => true,
        i18n: msg => msg.item.time,
        formatter: row => row.time?.toString?.() ?? '',
    },
}

function generateCsvData(rows: timer.stat.Row[], filterParam: ReportFilterOption, categories: timer.site.Cate[]): string[][] {
    const { siteMerge, mergeDate } = filterParam

    const colConfigs = Object.values(CSV_COLUMN_CONFIGS).filter(({ visible }) => visible?.(mergeDate, siteMerge))

    const columnTitles = colConfigs.map(({ i18n }) => t(i18n))
    const lines = rows.map(row => colConfigs.map(({ formatter }) => formatter(row, categories)))
    return [columnTitles, ...lines]
}

/**
 * Export csv data
 *
 * @param filterParam filter params
 * @param rows row data
 */
export function exportCsv(filterParam: ReportFilterOption, rows: timer.stat.Row[], categories: timer.site.Cate[]): void {
    const fileName = computeFileName(filterParam)
    const csvData = generateCsvData(rows, filterParam, categories)
    exportCsv_(csvData, fileName)
}