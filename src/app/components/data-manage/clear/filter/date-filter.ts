/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElDatePicker } from "element-plus"
import { Ref, h, defineComponent, PropType } from "vue"
import { formatTime, MILL_PER_DAY } from "@util/time"
import { t, tN } from "@app/locale"
import { DataManageMessage } from "@i18n/message/app/data-manage"
import { stepNoClz } from "./constants"

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

const dateFormat = t(msg => msg.calendar.dateFormat, { y: 'YYYY', m: 'MM', d: 'DD' })
// The birthday of browser
const startPlaceholder = t(msg => msg.calendar.dateFormat, { y: '1994', m: '12', d: '15' })
const endPlaceholder = formatTime(yesterday, t(msg => msg.calendar.dateFormat))

const _default = defineComponent({
    name: "DateFilter",
    emits: {
        change: (_date: Date[]) => true
    },
    props: {
        dateRange: Array as PropType<Date[]>
    },
    setup(props, ctx) {
        return () => h('p', [
            h('a', { class: stepNoClz }, '1.'),
            tN(msg => msg.dataManage.filterDate, {
                // @ts-ignore
                picker: h(ElDatePicker, {
                    modelValue: props.dateRange,
                    "onUpdate:modelValue": (date: Array<Date>) => ctx.emit('change', date),
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
            })
        ])
    }
})

export default _default
