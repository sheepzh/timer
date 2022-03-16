/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElOption, ElSelect } from "element-plus"
import { ref, Ref, h } from "vue"
import timerService, { HostSet } from "@service/timer-service"
import { daysAgo } from "@util/time"
import { t } from "@app/locale"
import HostOptionInfo from "../host-option-info"
import { TrendMessage } from "@app/locale/components/trend"
import DateRangeFilterItem from "@app/components/common/date-range-filter-item"
import { ElementDatePickerShortcut } from "@app/element-ui/date"

type _Props = {
    dateRangeRef: Ref<Date[]>
    domainKeyRef: Ref<string>
}

export type FilterProps = _Props

const trendSearchingRef: Ref<boolean> = ref(false)
const trendDomainOptionsRef: Ref<HostOptionInfo[]> = ref([])

// Host select
const renderOption = (hostInfo: HostOptionInfo) => h(ElOption, { value: hostInfo.key(), label: hostInfo.toString() })

const domainSelectOptions = () => trendDomainOptionsRef.value.map(domainInfo => renderOption(domainInfo))
const handleRemoteSearch = async (queryStr: string) => {
    if (!queryStr) {
        trendDomainOptionsRef.value = []
        return
    }
    trendSearchingRef.value = true
    const domains: HostSet = await timerService.listHosts(queryStr)
    const options: HostOptionInfo[] = []
    domains.origin.forEach(host => options.push(HostOptionInfo.origin(host)))
    domains.merged.forEach(host => options.push(HostOptionInfo.merged(host)))
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

function datePickerShortcut(msg: keyof TrendMessage, agoOfStart?: number, agoOfEnd?: number): ElementDatePickerShortcut {
    return {
        text: t(messages => messages.trend[msg]),
        value: daysAgo(agoOfStart || 0, agoOfEnd || 0)
    }
}
const shortcuts = [
    datePickerShortcut('lateWeek', 7),
    datePickerShortcut('late15Days', 15),
    datePickerShortcut('late30Days', 30),
    datePickerShortcut("late90Days", 90)
]
// Date picker
const startPlaceholder = t(msg => msg.trend.startDate)
const endPlaceholder = t(msg => msg.trend.endDate)
const datePickerItem = (props: _Props) => h(DateRangeFilterItem, {
    startPlaceholder,
    endPlaceholder,
    shortcuts,
    onChange: (newVal: Date[]) => props.dateRangeRef.value = newVal,
    disabledDate: (date: Date) => date.getTime() > new Date().getTime(),
})

const filterItems = (props: _Props) => [domainSelect(props), datePickerItem(props)]

export default (props: _Props) => filterItems(props)

export function addToFilterOption(option: HostOptionInfo) { trendDomainOptionsRef.value.push(option) }