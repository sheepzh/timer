/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref, PropType } from "vue"
import type { CalendarMessage } from "@i18n/message/common/calendar"

import { ref, h, defineComponent, watch } from "vue"
import { daysAgo } from "@util/time"
import { t } from "@app/locale"
import { ElementDatePickerShortcut } from "@src/element-ui/date"
import DateRangeFilterItem from "@app/components/common/date-range-filter-item"
import TimeFormatFilterItem from "@app/components/common/time-format-filter-item"
import { FilterOption } from "../type"

type ShortCutProp = [label: keyof CalendarMessage['range'], dayAgo: number]

const shortcutProps: ShortCutProp[] = [
    ["last24Hours", 1],
    ["last3Days", 3],
    ["last7Days", 7],
    ["last15Days", 15],
    ["last30Days", 30],
    ["last60Days", 60]
]

function datePickerShortcut(msg: keyof CalendarMessage['range'], agoOfStart: number): ElementDatePickerShortcut {
    return {
        text: t(messages => messages.calendar.range[msg]),
        value: daysAgo(agoOfStart, 0)
    }
}

const SHORTCUTS: ElementDatePickerShortcut[] = shortcutProps.map(([label, dayAgo]) => datePickerShortcut(label, dayAgo))

const _default = defineComponent({
    name: "HabitFilter",
    props: {
        defaultValue: Object as PropType<FilterOption>,
    },
    emits: {
        change: (_option: FilterOption) => true
    },
    setup(props, ctx) {
        const dateRange: Ref<[Date, Date]> = ref(props.defaultValue?.dateRange || [null, null])
        const timeFormat: Ref<timer.app.TimeFormat> = ref(props.defaultValue?.timeFormat)

        watch(
            [dateRange, timeFormat],
            () => ctx.emit("change", {
                dateRange: dateRange.value,
                timeFormat: timeFormat.value,
            })
        )

        return () => [
            h(DateRangeFilterItem, {
                clearable: false,
                disabledDate: (date: Date) => date.getTime() > new Date().getTime(),
                defaultRange: dateRange.value,
                shortcuts: SHORTCUTS,
                onChange: (newVal: [Date, Date]) => dateRange.value = newVal
            }),
            h(TimeFormatFilterItem, {
                defaultValue: props.defaultValue?.timeFormat,
                onChange: (newVal: timer.app.TimeFormat) => timeFormat.value = newVal
            }),
        ]
    }
})

export default _default