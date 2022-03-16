/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElOption, ElSelect } from "element-plus"
import { ref, Ref, h } from "vue"
import { daysAgo } from "@util/time"
import { t } from "@app/locale"
import { HabitMessage } from "@app/locale/components/habit"
import SwitchFilterItem from "@app/components/common/switch-filter-item"
import { ElementDatePickerShortcut } from "@app/element-ui/date"
import DateRangeFilterItem from "@app/components/common/date-range-filter-item"

type _Props = {
    dateRangeRef: Ref<Date[]>
    periodSizeRef: Ref<string>
    averageRef: Ref<boolean>
}

export type FilterProps = _Props

const trendSearchingRef: Ref<boolean> = ref(false)

const options: { [size: string]: keyof HabitMessage['sizes'] } = {
    1: 'fifteen',
    2: 'halfHour',
    4: 'hour',
    8: 'twoHour'
}

// Period size select
const selectOptions = () => Object.entries(options)
    .map(([size, msg]) => h(ElOption, { label: t(root => root.habit.sizes[msg]), value: size }))
const periodSizeSelect = (periodSizeRef: Ref<string>) => h(ElSelect,
    {
        placeholder: t(msg => msg.trend.hostPlaceholder),
        class: 'filter-item',
        modelValue: periodSizeRef.value,
        filterable: true,
        loading: trendSearchingRef.value,
        onChange: (val: string) => periodSizeRef.value = val,
    }, selectOptions)

type ShortCutProp = [label: keyof HabitMessage['dateRange'], dayAgo: number]
const shortcutProps: ShortCutProp[] = [
    ["lateDay", 1],
    ["late3Days", 3],
    ["lateWeek", 7],
    ["late15Days", 15],
    ["late30Days", 30],
    ["late60Days", 60]
]
function datePickerShortcut(msg: keyof HabitMessage['dateRange'], agoOfStart: number): ElementDatePickerShortcut {
    return {
        text: t(messages => messages.habit.dateRange[msg]),
        value: daysAgo(agoOfStart, 0)
    }
}
const shortcuts: ElementDatePickerShortcut[] = shortcutProps.map(([label, dayAgo]) => datePickerShortcut(label, dayAgo))

const averageLabel = t(msg => msg.habit.average.label)
const dateRangeStartPlaceholder = t(msg => msg.trend.startDate)
const dateRangeEndPlaceholder = t(msg => msg.trend.endDate)
const childNodes = ({
    dateRangeRef,
    periodSizeRef,
    averageRef
}: _Props) => [
        // Size select
        periodSizeSelect(periodSizeRef),
        // Date range picker
        h(DateRangeFilterItem, {
            startPlaceholder: dateRangeStartPlaceholder,
            endPlaceholder: dateRangeEndPlaceholder,
            clearable: false,
            disabledDate: (date: Date) => date.getTime() > new Date().getTime(),
            shortcuts,
            onChange: (newVal: Date[]) => dateRangeRef.value = newVal
        }),
        // Average by date
        h(SwitchFilterItem, {
            label: averageLabel,
            defaultValue: averageRef.value,
            onChange: (newVal: boolean) => averageRef.value = newVal
        })
    ]

export default (props: _Props) => childNodes(props)