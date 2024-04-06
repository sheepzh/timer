/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { DateModelType, ElDatePicker } from "element-plus"
import { defineComponent, PropType } from "vue"
import { formatTime, MILL_PER_DAY } from "@util/time"
import { t } from "@app/locale"
import { DataManageMessage } from "@i18n/message/app/data-manage"
import I18nNode from "@app/components/common/I18nNode"
import { EL_DATE_FORMAT } from "@i18n/element"

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

// The birthday of browser
const startPlaceholder = t(msg => msg.calendar.dateFormat, { y: '1994', m: '12', d: '15' })
const endPlaceholder = formatTime(yesterday, t(msg => msg.calendar.dateFormat))

const _default = defineComponent({
    emits: {
        change: (_date: [DateModelType, DateModelType]) => true
    },
    props: {
        dateRange: Object as PropType<[DateModelType, DateModelType]>
    },
    setup(props, ctx) {
        return () => (
            <p key="foobar">
                <a class="step-no">1.</a>
                <I18nNode
                    path={msg => msg.dataManage.filterDate}
                    param={{
                        picker: <ElDatePicker
                            modelValue={props.dateRange}
                            onUpdate:modelValue={date => ctx.emit("change", date)}
                            size="small"
                            style={{ width: "250px" }}
                            startPlaceholder={startPlaceholder}
                            endPlaceholder={endPlaceholder}
                            dateFormat={EL_DATE_FORMAT}
                            type="daterange"
                            disabledDate={(date: Date) => date.getTime() > yesterday}
                            shortcuts={pickerShortcuts}
                            rangeSeparator="-"
                        />
                    }}
                />
            </p>
        )
    }
})

export default _default
