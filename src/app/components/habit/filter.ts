import { ElDatePicker, ElOption, ElSelect, ElSwitch } from "element-plus"
import { ref, Ref, h } from "vue"
import { daysAgo } from "../../../util/time"
import { t } from "../../locale"
import { PeriodMessage } from "../../locale/components/period"

const datePickerShortcut = (msg: keyof PeriodMessage['dateRange'], agoOfStart: number) => {
    return {
        text: t(messages => messages.period.dateRange[msg]),
        value: daysAgo(agoOfStart, 0)
    }
}

type _Props = {
    dateRangeRef: Ref<Date[]>
    periodSizeRef: Ref<string>
    averageRef: Ref<boolean>
}

export type FilterProps = _Props

const trenderSearchingRef: Ref<boolean> = ref(false)

const options: { [size: string]: keyof PeriodMessage['sizes'] } = {
    1: 'fifteen',
    2: 'halfHour',
    4: 'hour',
    8: 'twoHour'
}

// Period size select
const selectOptions = () => Object.entries(options)
    .map(([size, msg]) => h(ElOption, { label: t(root => root.period.sizes[msg]), value: size }))
const periodSizeSelect = (periodSizeRef: Ref<string>) => h(ElSelect,
    {
        placeholder: t(msg => msg.trender.hostPlaceholder),
        class: 'filter-item',
        modelValue: periodSizeRef.value,
        filterable: true,
        loading: trenderSearchingRef.value,
        onChange: (val: string) => periodSizeRef.value = val,
    }, selectOptions)

type ShortCutProp = [label: keyof PeriodMessage['dateRange'], dayAgo: number]
const shortcutProps: ShortCutProp[] = [
    ['latestDay', 1],
    ['latest3Days', 3],
    ['latestWeek', 7],
    ['latest15Days', 15],
    ['latest30Days', 30],
    ['latest60Days', 60]
]

const shortcuts = shortcutProps.map(([label, dayAgo]) => datePickerShortcut(label, dayAgo))

// Date picker
const picker = (dateRangeRef: Ref<Date[]>) => h(ElDatePicker, {
    modelValue: dateRangeRef.value,
    type: 'daterange',
    format: 'YYYY/MM/DD',
    clearable: false,
    rangeSeparator: '-',
    startPlaceholder: t(msg => msg.trender.startDate),
    endPlaceholder: t(msg => msg.trender.endDate),
    unlinkPanels: true,
    disabledDate: (date: Date) => date.getTime() > new Date().getTime(),
    shortcuts,
    'onUpdate:modelValue': (newVal: Date[]) => dateRangeRef.value = newVal
})
const datePickerItem = (dateRangeRef: Ref<Date[]>) => h('span', { class: 'filter-item' }, picker(dateRangeRef))

const averageName = () => h('a', { class: 'filter-name' }, t(msg => msg.period.average.label))
const averageSwitch = (averageRef: Ref<boolean>) => h(ElSwitch,
    {
        class: 'filter-item',
        modelValue: averageRef.value,
        onChange: (val: boolean) => averageRef.value = val
    }
)

const filterContainer = ({
    dateRangeRef,
    periodSizeRef,
    averageRef
}: _Props) => h('div',
    { class: 'filter-container' },
    [
        // Size select
        periodSizeSelect(periodSizeRef),
        // Date range picker
        datePickerItem(dateRangeRef),
        // Average by date
        averageName(), averageSwitch(averageRef)
    ]
)

export default filterContainer