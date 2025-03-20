/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import DateRangeFilterItem from "@app/components/common/filter/DateRangeFilterItem"
import TimeFormatFilterItem from "@app/components/common/filter/TimeFormatFilterItem"
import { t } from "@app/locale"
import { useState } from "@hooks"
import Flex from "@pages/components/Flex"
import { type ElementDatePickerShortcut } from "@pages/element-ui/date"
import { daysAgo } from "@util/time"
import { defineComponent, watch, type PropType } from "vue"

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
        defaultValue: {
            type: Object as PropType<FilterOption>,
            required: true,
        },
    },
    emits: {
        change: (_option: FilterOption) => true
    },
    setup(props, ctx) {
        const [dateRange, setDateRange] = useState(props.defaultValue.dateRange)
        const [timeFormat, setTimeFormat] = useState(props.defaultValue.timeFormat)

        watch([dateRange, timeFormat], () => ctx.emit("change", {
            dateRange: dateRange.value,
            timeFormat: timeFormat.value,
        }))

        return () => (
            <Flex gap={10}>
                <DateRangeFilterItem
                    clearable={false}
                    defaultRange={dateRange.value}
                    shortcuts={SHORTCUTS}
                    onChange={val => val && setDateRange(val)}
                />
                <TimeFormatFilterItem
                    defaultValue={timeFormat.value}
                    onChange={setTimeFormat}
                />
            </Flex>
        )
    }
})

export default _default