/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ElementDatePickerShortcut } from "@src/element-ui/date"

import { t } from "@app/locale"
import { ElDatePicker } from "element-plus"
import { defineComponent, ref, type PropType } from "vue"
import { daysAgo } from "@util/time"
import { EL_DATE_FORMAT } from "@i18n/element"

function datePickerShortcut(agoOfStart?: number, agoOfEnd?: number): ElementDatePickerShortcut {
    return {
        text: t(msg => msg.calendar.range.lastDays, { n: agoOfStart }),
        value: daysAgo(agoOfStart - 1 || 0, agoOfEnd || 0),
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
        const dateRange = ref<[Date, Date]>(props.dateRange)
        return () => (
            <div>
                <ElDatePicker
                    modelValue={dateRange.value}
                    disabledDate={(date: Date) => date.getTime() > new Date().getTime()}
                    format={EL_DATE_FORMAT}
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