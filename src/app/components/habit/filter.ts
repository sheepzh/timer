/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElDatePicker, ElOption, ElSelect } from "element-plus"
import { ref, Ref, h } from "vue"
import { daysAgo } from "@util/time"
import { t } from "@app/locale"
import { HabitMessage } from "@app/locale/components/habit"
import { renderFilterContainer, switchFilterItem } from "../common/filter"

const datePickerShortcut = (msg: keyof HabitMessage['dateRange'], agoOfStart: number) => {
    return {
        text: t(messages => messages.habit.dateRange[msg]),
        value: daysAgo(agoOfStart, 0)
    }
}

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

const shortcuts = shortcutProps.map(([label, dayAgo]) => datePickerShortcut(label, dayAgo))

// Date picker
const picker = (dateRangeRef: Ref<Date[]>) => h(ElDatePicker, {
    modelValue: dateRangeRef.value,
    type: 'daterange',
    format: 'YYYY/MM/DD',
    clearable: false,
    rangeSeparator: '-',
    startPlaceholder: t(msg => msg.trend.startDate),
    endPlaceholder: t(msg => msg.trend.endDate),
    unlinkPanels: true,
    disabledDate: (date: Date) => date.getTime() > new Date().getTime(),
    shortcuts,
    'onUpdate:modelValue': (newVal: Date[]) => dateRangeRef.value = newVal
})
const datePickerItem = (dateRangeRef: Ref<Date[]>) => h('span', { class: 'filter-item' }, picker(dateRangeRef))

const childNodes = ({
    dateRangeRef,
    periodSizeRef,
    averageRef
}: _Props) => [
        // Size select
        periodSizeSelect(periodSizeRef),
        // Date range picker
        datePickerItem(dateRangeRef),
        // Average by date
        ...switchFilterItem(averageRef, msg => msg.habit.average.label)
    ]

export default renderFilterContainer(childNodes)