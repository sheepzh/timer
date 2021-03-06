import { ElDatePicker, ElOption, ElSelect } from "element-plus"
import { ref, Ref, h } from "vue"
import timerService, { DomainSet } from "../../../../service/timer-service"
import { daysAgo } from "../../../../util/time"
import { t } from "../../../locale"
import { renderFilterContainer } from "../../common/filter"
import DomainOptionInfo from "../domain-option-info"

const datePickerShortcut = (msg: string, agoOfStart?: number, agoOfEnd?: number) => {
    return {
        text: t(messages => messages.trend[msg]),
        value: daysAgo(agoOfStart || 0, agoOfEnd || 0)
    }
}

type _Props = {
    dateRangeRef: Ref<Date[]>
    domainKeyRef: Ref<string>
}

export type FilterProps = _Props

const trendSearchingRef: Ref<boolean> = ref(false)
const trendDomainOptionsRef: Ref<DomainOptionInfo[]> = ref([])

// Domain select
const renderOption = (domainInfo: DomainOptionInfo) => h(ElOption, { value: domainInfo.key(), label: domainInfo.toString() })

const domainSelectOptions = () => trendDomainOptionsRef.value.map(domainInfo => renderOption(domainInfo))
const handleRemoteSearch = async (queryStr: string) => {
    if (!queryStr) {
        trendDomainOptionsRef.value = []
        return
    }
    trendSearchingRef.value = true
    const domains: DomainSet = await timerService.listDomains(queryStr)
    const options: DomainOptionInfo[] = []
    domains.origin.forEach(host => options.push(DomainOptionInfo.origin(host)))
    domains.merged.forEach(host => options.push(DomainOptionInfo.merged(host)))
    trendDomainOptionsRef.value = options
    trendSearchingRef.value = false
}

const domainSelect = ({ domainKeyRef }: _Props) => h(ElSelect,
    {
        placeholder: t(msg => msg.trend.hostPlaceholder),
        class: 'filter-item',
        modelValue: domainKeyRef.value,
        clearable: true,
        filterable: true,
        remote: true,
        loading: trendSearchingRef.value,
        remoteMethod: (query: string) => handleRemoteSearch(query),
        onChange: (key: string) => domainKeyRef.value = key,
        onClear: () => domainKeyRef.value = ''
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
    startPlaceholder: t(msg => msg.trend.startDate),
    endPlaceholder: t(msg => msg.trend.endDate),
    unlinkPanels: true,
    disabledDate: (date: Date) => date.getTime() > new Date().getTime(),
    shortcuts,
    'onUpdate:modelValue': (newVal: Date[]) => dateRangeRef.value = newVal
})
const datePickerItem = (props: _Props) => h('span', { class: 'filter-item' }, picker(props))

const filterItems = (props: _Props) => [domainSelect(props), datePickerItem(props)]

export default renderFilterContainer(filterItems)

export function addToFilterOption(option: DomainOptionInfo) { trendDomainOptionsRef.value.push(option) }
