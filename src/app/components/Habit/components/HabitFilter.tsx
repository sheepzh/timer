/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, watch, type PropType } from "vue"
import { daysAgo } from "@util/time"
import { t } from "@app/locale"
import { ElementDatePickerShortcut } from "@src/element-ui/date"
import DateRangeFilterItem from "@app/components/common/DateRangeFilterItem"
import TimeFormatFilterItem from "@app/components/common/TimeFormatFilterItem"
import { useState } from "@hooks"

export type FilterOption = {
    timeFormat: timer.app.TimeFormat
    dateRange: [Date, Date]
}

type ShortCutProp = [label: string, dayAgo: number]

const shortcutProps: ShortCutProp[] = [
    [t(msg => msg.calendar.range.today), 0],
    [t(msg => msg.calendar.range.lastDays, { n: 3 }), 3],
    [t(msg => msg.calendar.range.lastDays, { n: 7 }), 7],
    [t(msg => msg.calendar.range.lastDays, { n: 15 }), 15],
    [t(msg => msg.calendar.range.lastDays, { n: 30 }), 30],
    [t(msg => msg.calendar.range.lastDays, { n: 60 }), 60],
]

const SHORTCUTS: ElementDatePickerShortcut[] = shortcutProps.map(([text, agoOfStart]) => ({ text, value: daysAgo(agoOfStart, 0) }))

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