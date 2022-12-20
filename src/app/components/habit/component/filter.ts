/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { PropType } from "vue"
import type { HabitMessage } from "@i18n/message/app/habit"

import { ref, Ref, h, defineComponent } from "vue"
import { daysAgo } from "@util/time"
import { t } from "@app/locale"
import SwitchFilterItem from "@app/components/common/switch-filter-item"
import { ElementDatePickerShortcut } from "@src/element-ui/date"
import DateRangeFilterItem from "@app/components/common/date-range-filter-item"
import SelectFilterItem from "@app/components/common/select-filter-item"

export type HabitFilterOption = {
    periodSize: number
    dateRange: Date[]
    averageByDate: boolean
}

type ShortCutProp = [label: keyof HabitMessage['dateRange'], dayAgo: number]

const shortcutProps: ShortCutProp[] = [
    ["lastDay", 1],
    ["last3Days", 3],
    ["lastWeek", 7],
    ["last15Days", 15],
    ["last30Days", 30],
    ["last60Days", 60]
]

function datePickerShortcut(msg: keyof HabitMessage['dateRange'], agoOfStart: number): ElementDatePickerShortcut {
    return {
        text: t(messages => messages.habit.dateRange[msg]),
        value: daysAgo(agoOfStart, 0)
    }
}

const SHORTCUTS: ElementDatePickerShortcut[] = shortcutProps.map(([label, dayAgo]) => datePickerShortcut(label, dayAgo))
const AVERAGE_LABEL = t(msg => msg.habit.average.label)
const DATE_RANGE_START_PLACEHOLDER = t(msg => msg.trend.startDate)
const DATE_RANGE_END_PLACEHOLDER = t(msg => msg.trend.endDate)

// [value, label]
type _SizeOption = [number, keyof HabitMessage['sizes']]

function allOptions(): Record<number, string> {
    const allOptions = {}
    const allSizes: _SizeOption[] = [
        [1, 'fifteen'],
        [2, 'halfHour'],
        [4, 'hour'],
        [8, 'twoHour'],
    ]
    allSizes.forEach(([size, msg]) => allOptions[size] = t(root => root.habit.sizes[msg]))
    return allOptions
}

const _default = defineComponent({
    name: "HabitFilter",
    props: {
        periodSize: Number as PropType<number>,
        dateRange: Array as PropType<Date[]>,
        averageByDate: Boolean
    },
    emits: ["change"],
    setup(props, ctx) {
        const periodSize: Ref<number> = ref(props.periodSize || 1)
        // @ts-ignore
        const dateRange: Ref<Date[]> = ref(props.dateRange || [])
        const averageByDate: Ref<boolean> = ref(props.averageByDate || false)
        function handleChange() {
            ctx.emit("change", {
                periodSize: periodSize.value,
                dateRange: dateRange.value,
                averageByDate: averageByDate.value
            } as HabitFilterOption)
        }
        return () => [
            // Size select
            h(SelectFilterItem, {
                historyName: 'periodSize',
                defaultValue: periodSize.value?.toString?.(),
                options: allOptions(),
                onSelect(val: string) {
                    const newPeriodSize = parseInt(val)
                    if (isNaN(newPeriodSize)) {
                        return
                    }
                    periodSize.value = newPeriodSize
                    handleChange()
                },
            }),
            // Date range picker
            h(DateRangeFilterItem, {
                startPlaceholder: DATE_RANGE_START_PLACEHOLDER,
                endPlaceholder: DATE_RANGE_END_PLACEHOLDER,
                clearable: false,
                disabledDate: (date: Date) => date.getTime() > new Date().getTime(),
                defaultRange: dateRange.value,
                shortcuts: SHORTCUTS,
                onChange: (newVal: Date[]) => {
                    dateRange.value = newVal
                    handleChange()
                }
            }),
            // Average by date
            h(SwitchFilterItem, {
                historyName: 'average',
                label: AVERAGE_LABEL,
                defaultValue: averageByDate.value,
                onChange: (newVal: boolean) => {
                    averageByDate.value = newVal
                    handleChange()
                }
            })
        ]
    }
})

export default _default