/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { renderFilterContainer } from "@app/components/common/filter"
import dateRange, { DateRangeFilterItemProps } from "./date-range-filter-item"
import displayBySecond, { DisplayBySecondFilterItemProps } from "./display-by-second-filter-item"
import DownloadFile, { FileFormat } from "./download-file"
import mergeDate, { MergeDateFilterItemProps } from "./merge-date-filter-item"
import mergeHost, { MergeHostFilterItemProps } from "./merge-host-filter-item"
import { Ref, h } from "vue"
import DataItem from "@entity/dto/data-item"
import { t } from "@app/locale"
import { dateFormatter, periodFormatter } from "../formatter"
import { exportCsv, exportJson } from "@util/file"
import InputFilterItem from '@app/components/common/input-filter-item'

export type FilterProps = DateRangeFilterItemProps
    & MergeDateFilterItemProps
    & MergeHostFilterItemProps
    & DisplayBySecondFilterItemProps
    & {
        hostRef: Ref<string>
        dataRef: Ref<DataItem[]>
        exportFileName: Ref<string>
    }

/** 
 * @param rows row data
 * @returns data with csv format 
 */
const generateCsvData = (rows: DataItem[], mergeDate: boolean) => {
    let columnName: Array<keyof DataItem> = []
    !mergeDate && columnName.push('date')
    columnName = [...columnName, 'host', 'total', 'focus', 'time']
    const data = [columnName.map(c => t(msg => msg.item[c]))]
    rows.forEach(row => {
        const csvR = []
        !mergeDate && csvR.push(dateFormatter(row.date))
        data.push([...csvR, row.host, periodFormatter(row.total, true), periodFormatter(row.focus, true), row.time])
    })
    return data
}

type ExportInfo = {
    host: string
    date?: string
    total?: string
    focus?: string
    time?: number
}

/** 
 * @param rows row data
 * @returns data with json format 
 */
const generateJsonData = (rows: DataItem[]) => {
    return rows.map(row => {
        const data: ExportInfo = { host: row.host }
        // Always display by seconds
        data.total = periodFormatter(row.total, true, true)
        data.focus = periodFormatter(row.focus, true, true)
        data.time = row.time
        return data
    })
}

const hostPlaceholder = t(msg => msg.report.hostPlaceholder)
const childNodes = (props: FilterProps) =>
    [
        h(InputFilterItem, {
            placeholder: hostPlaceholder,
            onClear() {
                props.hostRef.value = ""
                props.queryData?.()
            },
            onEnter(newVal: string) {
                props.hostRef.value = newVal
                props.queryData?.()
            }
        }),
        // inputFilterItem(props.hostRef, msg => msg.report.hostPlaceholder, props.queryData),
        dateRange(props),
        ...mergeDate(props),
        ...mergeHost(props),
        ...displayBySecond(props),
        h(DownloadFile, {
            onDownload(format: FileFormat) {
                const rows = props.dataRef.value
                const fileName = props.exportFileName.value
                format === 'json' && exportJson(generateJsonData(rows), fileName)
                format === 'csv' && exportCsv(generateCsvData(rows, props.mergeDateRef.value), fileName)
            }
        })
    ]

export default renderFilterContainer(childNodes)