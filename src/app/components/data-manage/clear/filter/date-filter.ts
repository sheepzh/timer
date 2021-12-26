/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElDatePicker } from "element-plus"
import { Ref, h } from "vue"
import { formatTime, MILL_PER_DAY } from "@util/time"
import { t, tN } from "@app/locale"
import { DataManageMessage } from "@app/locale/components/data-manage"
import { stepNoClz } from "./constants"

export type DateFilterProps = {
    dateRangeRef: Ref<Date[]>
}

const yesterday = new Date().getTime() - MILL_PER_DAY
const yesterdayMsg = formatTime(yesterday, '{y}/{m}/{d}')
const daysBefore = (days: number) => new Date().getTime() - days * MILL_PER_DAY

const birthdayOfBrowser = new Date()
birthdayOfBrowser.setFullYear(1994)
birthdayOfBrowser.setMonth(12 - 1)
birthdayOfBrowser.setDate(15)

const datePickerShortcut = (msg: keyof DataManageMessage['dateShortcut'], days: number) => {
    const text = t(messages => messages.dataManage.dateShortcut[msg])
    const value = [birthdayOfBrowser, daysBefore(days)]
    return { text, value }
}

const pickerShortcuts = [
    datePickerShortcut('tillYesterday', 1),
    datePickerShortcut('till7DaysAgo', 7),
    datePickerShortcut('till30DaysAgo', 30)
]

const basePickerProps = {
    size: 'mini',
    style: 'width:250px;',
    startPlaceholder: '1994/12/15',
    format: "YYYY/MM/DD",
    endPlaceholder: yesterdayMsg,
    type: 'daterange',
    disabledDate(date: Date) { return date.getTime() > yesterday },
    shortcuts: pickerShortcuts,
    rangeSeparator: '-'
}

const picker = ({ dateRangeRef }: DateFilterProps) => h<{}>(ElDatePicker, {
    modelValue: dateRangeRef.value,
    "onUpdate:modelValue": (date: Array<Date>) => dateRangeRef.value = date,
    ...basePickerProps
})

const dateFilter = (props: DateFilterProps) => h('p', [
    h('a', { class: stepNoClz }, '1.'),
    tN(msg => msg.dataManage.filterDate, { picker: picker(props) })
])

export default dateFilter
