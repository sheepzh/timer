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


function picker({ dateRangeRef }: DateFilterProps) {
    const dateFormat = t(msg => msg.calendar.dateFormat, { y: 'YYYY', m: 'MM', d: 'DD' })
    // The birthday of browser
    const startPlaceholder = t(msg => msg.calendar.dateFormat, { y: '1994', m: '12', d: '15' })
    const endPlaceholder = formatTime(yesterday, t(msg => msg.calendar.dateFormat))
    // @ts-ignore
    return h(ElDatePicker, {
        modelValue: dateRangeRef.value,
        "onUpdate:modelValue": (date: Array<Date>) => dateRangeRef.value = date,
        size: 'small',
        style: 'width: 250px;',
        startPlaceholder,
        format: dateFormat,
        endPlaceholder,
        type: 'daterange',
        disabledDate(date: Date) { return date.getTime() > yesterday },
        shortcuts: pickerShortcuts,
        rangeSeparator: '-'
    })
}

const dateFilter = (props: DateFilterProps) => h('p', [
    h('a', { class: stepNoClz }, '1.'),
    tN(msg => msg.dataManage.filterDate, { picker: picker(props) })
])

export default dateFilter
