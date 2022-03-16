/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import DownloadFile, { FileFormat } from "./download-file"
import { Ref, h } from "vue"
import DataItem from "@entity/dto/data-item"
import { t } from "@app/locale"
import { dateFormatter, periodFormatter } from "../formatter"
import { exportCsv, exportJson } from "@util/file"
import InputFilterItem from '@app/components/common/input-filter-item'
import SwitchFilterItem from "@app/components/common/switch-filter-item"
import DateRangeFilterItem from "@app/components/common/date-range-filter-item"
import { ElementDatePickerShortcut } from "@app/element-ui/date"
import { daysAgo } from "@util/time"
import { ReportMessage } from "@app/locale/components/report"
import { QueryData } from "@app/components/common/constants"

export type FilterProps = {
    displayBySecondRef: Ref<boolean>
    hostRef: Ref<string>
    dataRef: Ref<DataItem[]>
    mergeHostRef: Ref<boolean>
    mergeDateRef: Ref<boolean>
    exportFileName: Ref<string>
    queryData: QueryData
    dateRangeRef: Ref<Date[]>
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
const mergeDateLabel = t(msg => msg.report.mergeDate)
const mergeHostLabel = t(msg => msg.report.mergeDomain)
const displayBySecondLabel = t(msg => msg.report.displayBySecond)
// Date range
const dateStartPlaceholder = t(msg => msg.report.startDate)
const dateEndPlaceholder = t(msg => msg.report.endDate)
// date range
function datePickerShortcut(msg: keyof ReportMessage, agoOfStart?: number, agoOfEnd?: number): ElementDatePickerShortcut {
    const text = t(messages => messages.report[msg])
    const value = daysAgo(agoOfStart || 0, agoOfEnd || 0)
    return { text, value }
}
const dateShortcuts: ElementDatePickerShortcut[] = [
    datePickerShortcut('today'),
    datePickerShortcut('yesterday', 1, 1),
    datePickerShortcut('lateWeek', 7),
    datePickerShortcut('late30Days', 30)
]
const childNodes = (props: FilterProps) => [
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
    h(DateRangeFilterItem, {
        startPlaceholder: dateStartPlaceholder,
        endPlaceholder: dateEndPlaceholder,
        disabledDate: (date: Date | number) => new Date(date) > new Date(),
        shortcuts: dateShortcuts,
        onChange(newVal: Date[]) {
            props.dateRangeRef.value = newVal
            props.queryData()
        }
    }),
    h(SwitchFilterItem, {
        label: mergeDateLabel,
        defaultValue: props.mergeDateRef.value,
        onChange(newVal: boolean) {
            props.mergeDateRef.value = newVal
            props.queryData?.()
        }
    }),
    h(SwitchFilterItem, {
        label: mergeHostLabel,
        defaultValue: props.mergeHostRef.value,
        onChange(newVal: boolean) {
            props.mergeHostRef.value = newVal
            props.queryData?.()
        }
    }),
    h(SwitchFilterItem, {
        label: displayBySecondLabel,
        defaultValue: props.displayBySecondRef.value,
        onChange(newVal: boolean) {
            props.displayBySecondRef.value = newVal
            props.queryData?.()
        }
    }),
    h(DownloadFile, {
        onDownload(format: FileFormat) {
            const rows = props.dataRef.value
            const fileName = props.exportFileName.value
            format === 'json' && exportJson(generateJsonData(rows), fileName)
            format === 'csv' && exportCsv(generateCsvData(rows, props.mergeDateRef.value), fileName)
        }
    })
]

export default (props: FilterProps) => childNodes(props)