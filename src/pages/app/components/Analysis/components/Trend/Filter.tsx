/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { dateFormat } from "@i18n/element"
import { type ElementDatePickerShortcut } from "@pages/element-ui/date"
import { getDatePickerIconSlots } from "@pages/element-ui/rtl"
import { daysAgo } from "@util/time"
import { ElDatePicker } from "element-plus"
import { defineComponent, ref, type PropType } from "vue"

function datePickerShortcut(agoOfStart?: number, agoOfEnd?: number): ElementDatePickerShortcut {
    return {
        text: t(msg => msg.calendar.range.lastDays, { n: agoOfStart }),
        value: daysAgo((agoOfStart ?? 0) - 1 || 0, agoOfEnd || 0),
    }
}

const SHORTCUTS = [
    datePickerShortcut(7),
    datePickerShortcut(15),
    datePickerShortcut(30),
    datePickerShortcut(90),
]

const _default = defineComponent({
    props: {
        dateRange: [Object, Object] as PropType<[Date, Date]>
    },
    emits: {
        dateRangeChange: (_val: [Date, Date]) => true
    },
    setup(props, ctx) {
        const dateRange = ref<[Date, Date] | undefined>(props.dateRange)
        return () => (
            <div>
                <ElDatePicker
                    modelValue={dateRange.value}
                    disabledDate={(date: Date) => date.getTime() > new Date().getTime()}
                    format={dateFormat()}
                    type="daterange"
                    shortcuts={SHORTCUTS}
                    rangeSeparator="-"
                    clearable={false}
                    onUpdate:modelValue={(newVal: [Date, Date]) => ctx.emit("dateRangeChange", dateRange.value = newVal)}
                    v-slots={getDatePickerIconSlots()}
                />
            </div>
        )
    }
})

export default _default