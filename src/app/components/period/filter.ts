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
    mergeRef: Ref<boolean>
}

export type FilterProps = _Props

const trenderSearchingRef: Ref<boolean> = ref(false)

const options: { [size: string]: keyof PeriodMessage['sizes'] } = {
    1: 'fifteen',
    2: 'halfHour',
    4: 'hour'
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

const shortcuts = [
    datePickerShortcut('latestDay', 1),
    datePickerShortcut('latestWeek', 7),
    datePickerShortcut('latest15Days', 15),
]
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

const mergeName = () => h('a', { class: 'filter-name' }, t(msg => msg.period.merge.label))
const mergeSwitch = (mergeRef: Ref<boolean>) => h(ElSwitch,
    {
        class: 'filter-item',
        modelValue: mergeRef.value,
        onChange: (val: boolean) => mergeRef.value = val
    }
)

const filterContainer = ({
    dateRangeRef,
    periodSizeRef,
    mergeRef
}: _Props) => h('div',
    { class: 'filter-container' },
    [
        // Size select
        periodSizeSelect(periodSizeRef),
        // Date range picker
        datePickerItem(dateRangeRef),
        // Merge date
        mergeName(), mergeSwitch(mergeRef)
    ]
)

export default filterContainer