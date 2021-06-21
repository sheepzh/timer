import { ElDatePicker, ElOption, ElSelect } from "element-plus"
import { ref, Ref, h } from "vue"
import timerService from "../../../../service/timer-service"
import { daysAgo, MILL_PER_DAY } from "../../../../util/time"
import { t } from "../../../locale"

const datePickerShortcut = (msg: string, agoOfStart?: number, agoOfEnd?: number) => {
    return {
        text: t(messages => messages.trender[msg]),
        value: daysAgo(agoOfStart || 0, (agoOfEnd || 0) + 1)
    }
}

type _Props = {
    dateRangeRef: Ref<Date[]>
    trenderDomainRef: Ref<string>
}

export type FilterProps = _Props

const trenderSearchingRef: Ref<boolean> = ref(false)
const trenderDomainOptionsRef: Ref<Array<string>> = ref([])

// Domain select
const domainSelectOptions = () => trenderDomainOptionsRef.value.map(domain => h(ElOption, { label: domain, value: domain }))
const handleRemoteSearch = async (queryStr: string) => {
    if (!queryStr) {
        trenderDomainOptionsRef.value = []
        return
    }
    trenderSearchingRef.value = true
    const domains = await timerService.listDomains(queryStr)
    trenderDomainOptionsRef.value = Array.from(domains)
    trenderSearchingRef.value = false
}
const domainSelect = ({ trenderDomainRef }: _Props) => h(ElSelect,
    {
        placeholder: t(msg => msg.trender.hostPlaceholder),
        class: 'filter-item',
        modelValue: trenderDomainRef.value,
        clearable: true,
        filterable: true,
        remote: true,
        loading: trenderSearchingRef.value,
        remoteMethod: (query: string) => handleRemoteSearch(query),
        onChange: (val: string) => trenderDomainRef.value = val,
        onClear: () => trenderDomainRef.value = ''
    }, domainSelectOptions)

const shortcuts = [
    datePickerShortcut('latestWeek', 7),
    datePickerShortcut('latest15Days', 15),
    datePickerShortcut('latest30Days', 30),
    datePickerShortcut('latest90Days', 90)
]
// Date picker
const picker = ({ dateRangeRef }: _Props) => h(ElDatePicker, {
    modelValue: dateRangeRef.value,
    type: 'daterange',
    format: 'YYYY/MM/DD',
    rangeSeparator: '-',
    startPlaceholder: t(msg => msg.trender.startDate),
    endPlaceholder: t(msg => msg.trender.endDate),
    unlinkPanels: true,
    disabledDate: (date: Date) => date.getTime() > new Date().getTime() - MILL_PER_DAY,
    shortcuts,
    'onUpdate:modelValue': (newVal: Date[]) => dateRangeRef.value = newVal
})
const datePickerItem = (props: _Props) => h('span', { class: 'filter-item' }, picker(props))

const filterContainer = (props: _Props) => h('div', { class: 'filter-container' }, [domainSelect(props), datePickerItem(props)])

export default filterContainer