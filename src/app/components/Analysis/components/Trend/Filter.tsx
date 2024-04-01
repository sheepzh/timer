/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ElementDatePickerShortcut } from "@src/element-ui/date"
import type { PropType } from "vue"
import type { CalendarMessage } from "@i18n/message/common/calendar"

import { t } from "@app/locale"
import { ElDatePicker } from "element-plus"
import { defineComponent, ref } from "vue"
import { daysAgo } from "@util/time"

function datePickerShortcut(msgKey: keyof CalendarMessage['range'], agoOfStart?: number, agoOfEnd?: number): ElementDatePickerShortcut {
    return {
        text: t(msg => msg.calendar.range[msgKey]),
        value: daysAgo(agoOfStart - 1 || 0, agoOfEnd || 0)
    }
}

const DATE_FORMAT = t(msg => msg.calendar.dateFormat, {
    y: 'YYYY',
    m: 'MM',
    d: 'DD'
})

const SHORTCUTS = [
    datePickerShortcut('last7Days', 7),
    datePickerShortcut('last15Days', 15),
    datePickerShortcut('last30Days', 30),
    datePickerShortcut("last90Days", 90)
]

const _default = defineComponent({
    props: {
        dateRange: [Object, Object] as PropType<[Date, Date]>
    },
    emits: {
        dateRangeChange: (_val: [Date, Date]) => true
    },
    setup(props, ctx) {
        const dateRange = ref<[Date, Date]>(props.dateRange)
        return () => (
            <div>
                <ElDatePicker
                    modelValue={dateRange.value}
                    disabledDate={(date: Date) => date.getTime() > new Date().getTime()}
                    format={DATE_FORMAT}
                    type="daterange"
                    shortcuts={SHORTCUTS}
                    rangeSeparator="-"
                    clearable={false}
                    onUpdate:modelValue={(newVal: [Date, Date]) => ctx.emit("dateRangeChange", dateRange.value = newVal)}
                />
            </div>
        )
    }
})

export default _default