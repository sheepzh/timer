/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElDatePicker } from "element-plus"
import { h, Ref } from "vue"
import { daysAgo } from "@util/time"
import { t } from "@app/locale"
import { ReportMessage } from "@app/locale/components/report"
import { QueryData } from "@app/components/common/constants"

export type DateRangeFilterItemProps = {
    dateRangeRef: Ref<Date[]>
    queryData: QueryData
}

// date range
const datePickerShortcut = (msg: keyof ReportMessage, agoOfStart?: number, agoOfEnd?: number) => {
    const text = t(messages => messages.report[msg])
    const value = daysAgo(agoOfStart || 0, agoOfEnd || 0)
    return { text, value }
}

const shortcuts = [
    datePickerShortcut('today'),
    datePickerShortcut('yesterday', 1, 1),
    datePickerShortcut('lateWeek', 7),
    datePickerShortcut('late30Days', 30)
]

const handleUpdate = (props: DateRangeFilterItemProps, date: Array<Date>) => {
    props.dateRangeRef.value = date
    props.queryData()
}

const dateRangePicker = (props: DateRangeFilterItemProps) => h(ElDatePicker,
    {
        modelValue: props.dateRangeRef.value,
        format: 'YYYY/MM/DD',
        type: 'daterange',
        rangeSeparator: '-',
        disabledDate: (date: Date | number) => new Date(date) > new Date(),
        shortcuts,
        'onUpdate:modelValue': (date: Array<Date>) => handleUpdate(props, date),
        startPlaceholder: t(msg => msg.report.startDate),
        endPlaceholder: t(msg => msg.report.endDate)
    }
)

const dateRange = (props: DateRangeFilterItemProps) => h('span', { class: 'filter-item' }, [dateRangePicker(props)])

export default dateRange