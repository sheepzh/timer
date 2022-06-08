/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { Ref, PropType } from "vue"

import { ElOption, ElSelect } from "element-plus"
import { ref, h, defineComponent } from "vue"
import timerService, { HostSet } from "@service/timer-service"
import { daysAgo } from "@util/time"
import { t } from "@app/locale"
import HostOptionInfo from "../host-option-info"
import { TrendMessage } from "@app/locale/components/trend"
import DateRangeFilterItem from "@app/components/common/date-range-filter-item"
import { ElementDatePickerShortcut } from "@app/element-ui/date"

const renderOption = (hostInfo: HostOptionInfo) => h(ElOption, { value: hostInfo.key(), label: hostInfo.toString() })

async function handleRemoteSearch(queryStr: string, trendDomainOptions: Ref<HostOptionInfo[]>, searching: Ref<boolean>) {
    if (!queryStr) {
        trendDomainOptions.value = []
        return
    }
    searching.value = true
    const domains: HostSet = await timerService.listHosts(queryStr)
    const options: HostOptionInfo[] = []
    domains.origin.forEach(host => options.push(HostOptionInfo.origin(host)))
    domains.merged.forEach(host => options.push(HostOptionInfo.merged(host)))
    trendDomainOptions.value = options
    searching.value = false
}

function datePickerShortcut(msg: keyof TrendMessage, agoOfStart?: number, agoOfEnd?: number): ElementDatePickerShortcut {
    return {
        text: t(messages => messages.trend[msg]),
        value: daysAgo(agoOfStart || 0, agoOfEnd || 0)
    }
}
const SHORTCUTS = [
    datePickerShortcut('lateWeek', 7),
    datePickerShortcut('late15Days', 15),
    datePickerShortcut('late30Days', 30),
    datePickerShortcut("late90Days", 90)
]

const HOST_PLACEHOLDER = t(msg => msg.trend.hostPlaceholder)
// Date picker
const START_DATE_PLACEHOLDER = t(msg => msg.trend.startDate)
const END_DATE_PLACEHOLDER = t(msg => msg.trend.endDate)

const _default = defineComponent({
    name: "TrendFilter",
    props: {
        dateRange: Object as PropType<Date[]>,
        defaultValue: Object as PropType<HostOptionInfo>
    },
    emits: ['change'],
    setup(props, ctx) {
        // @ts-ignore
        const dateRange: Ref<Date[]> = ref(props.dateRange)
        const domainKey: Ref<string> = ref('')
        const trendSearching: Ref<boolean> = ref(false)
        const trendDomainOptions: Ref<HostOptionInfo[]> = ref([])
        const defaultOption: HostOptionInfo = props.defaultValue
        if (defaultOption) {
            domainKey.value = defaultOption.key()
            trendDomainOptions.value.push(defaultOption)
        }

        function handleChange() {
            const hostOption: HostOptionInfo = HostOptionInfo.from(domainKey.value)
            ctx.emit('change', hostOption, dateRange.value)
        }

        return () => [h(ElSelect, {
            placeholder: HOST_PLACEHOLDER,
            class: 'filter-item',
            modelValue: domainKey.value,
            clearable: true,
            filterable: true,
            remote: true,
            loading: trendSearching.value,
            remoteMethod: (query: string) => handleRemoteSearch(query, trendDomainOptions, trendSearching),
            onChange: (key: string) => {
                domainKey.value = key
                handleChange()
            },
            onClear: () => {
                domainKey.value = ''
                handleChange()
            }
        }, () => trendDomainOptions.value?.map(renderOption) || []),
        h(DateRangeFilterItem, {
            defaultRange: dateRange.value,
            startPlaceholder: START_DATE_PLACEHOLDER,
            endPlaceholder: END_DATE_PLACEHOLDER,
            shortcuts: SHORTCUTS,
            onChange: (newVal: Date[]) => {
                dateRange.value = newVal
                handleChange()
            },
            clearable: false,
            disabledDate: (date: Date) => date.getTime() > new Date().getTime(),
        })]
    }
})

export default _default