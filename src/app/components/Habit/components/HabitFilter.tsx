/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { CalendarMessage } from "@i18n/message/common/calendar"

import { defineComponent, watch, type PropType } from "vue"
import { daysAgo } from "@util/time"
import { t } from "@app/locale"
import { ElementDatePickerShortcut } from "@src/element-ui/date"
import DateRangeFilterItem from "@app/components/common/DateRangeFilterItem"
import TimeFormatFilterItem from "@app/components/common/TimeFormatFilterItem"
import { FilterOption } from "../type"
import { useState } from "@hooks"

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
    props: {
        defaultValue: Object as PropType<FilterOption>,
    },
    emits: {
        change: (_option: FilterOption) => true
    },
    setup(props, ctx) {
        const [dateRange, setDateRange] = useState<[Date, Date]>(props.defaultValue?.dateRange || [null, null])
        const [timeFormat, setTimeFormat] = useState(props.defaultValue?.timeFormat)

        watch([dateRange, timeFormat], () => ctx.emit("change", {
            dateRange: dateRange.value,
            timeFormat: timeFormat.value,
        }))

        return () => <>
            <DateRangeFilterItem
                clearable={false}
                disabledDate={(date: Date) => date.getTime() > new Date().getTime()}
                defaultRange={dateRange.value}
                shortcuts={SHORTCUTS}
                onChange={setDateRange}
            />
            <TimeFormatFilterItem
                defaultValue={timeFormat.value}
                onChange={setTimeFormat}
            />
        </>
    }
})

export default _default