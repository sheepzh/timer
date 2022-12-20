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
import { TrendMessage } from "@i18n/message/app/trend"
import DateRangeFilterItem from "@app/components/common/date-range-filter-item"
import SelectFilterItem from "@app/components/common/select-filter-item"
import { ElementDatePickerShortcut } from "@src/element-ui/date"
import { labelOfHostInfo } from "./common"

async function handleRemoteSearch(queryStr: string, trendDomainOptions: Ref<timer.app.trend.HostInfo[]>, searching: Ref<boolean>) {
    if (!queryStr) {
        trendDomainOptions.value = []
        return
    }
    searching.value = true
    const domains: HostSet = await timerService.listHosts(queryStr)
    const options: timer.app.trend.HostInfo[] = []
    domains.origin.forEach(host => options.push({ host, merged: false }))
    domains.merged.forEach(host => options.push({ host, merged: true }))
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
    datePickerShortcut('lastWeek', 7),
    datePickerShortcut('last15Days', 15),
    datePickerShortcut('last30Days', 30),
    datePickerShortcut("last90Days", 90)
]

const HOST_PLACEHOLDER = t(msg => msg.trend.hostPlaceholder)
// Date picker
const START_DATE_PLACEHOLDER = t(msg => msg.trend.startDate)
const END_DATE_PLACEHOLDER = t(msg => msg.trend.endDate)

const TIME_FORMAT_LABELS: { [key in timer.app.TimeFormat]: string } = {
    default: t(msg => msg.timeFormat.default),
    second: t(msg => msg.timeFormat.second),
    minute: t(msg => msg.timeFormat.minute),
    hour: t(msg => msg.timeFormat.hour)
}

function keyOfHostInfo(option: timer.app.trend.HostInfo): string {
    const { merged, host } = option
    return (merged ? "1" : '0') + (host || '')
}

function hostInfoOfKey(key: string): timer.app.trend.HostInfo {
    if (!key || !key.length) return { host: '', merged: false }
    const merged = key.charAt(0) === '1'
    return { host: key.substring(1), merged }
}

const _default = defineComponent({
    name: "TrendFilter",
    props: {
        dateRange: Object as PropType<Date[]>,
        defaultValue: Object as PropType<timer.app.trend.HostInfo>,
        timeFormat: String as PropType<timer.app.TimeFormat>
    },
    emits: ['change'],
    setup(props, ctx) {
        // @ts-ignore
        const dateRange: Ref<Date[]> = ref(props.dateRange)
        const domainKey: Ref<string> = ref('')
        const trendSearching: Ref<boolean> = ref(false)
        const trendDomainOptions: Ref<timer.app.trend.HostInfo[]> = ref([])
        const defaultOption: timer.app.trend.HostInfo = props.defaultValue
        const timeFormat: Ref<timer.app.TimeFormat> = ref(props.timeFormat)
        if (defaultOption) {
            domainKey.value = keyOfHostInfo(defaultOption)
            trendDomainOptions.value.push(defaultOption)
        }

        function handleChange() {
            const hostInfo: timer.app.trend.HostInfo = hostInfoOfKey(domainKey.value)
            const option: timer.app.trend.FilterOption = {
                host: hostInfo,
                dateRange: dateRange.value,
                timeFormat: timeFormat.value
            }
            ctx.emit('change', option)
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
        }, () => (trendDomainOptions.value || [])?.map(
            hostInfo => h(ElOption, { value: keyOfHostInfo(hostInfo), label: labelOfHostInfo(hostInfo) })
        )),
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
        }),
        h(SelectFilterItem, {
            historyName: 'timeFormat',
            defaultValue: timeFormat.value,
            options: TIME_FORMAT_LABELS,
            onSelect(newVal: timer.app.TimeFormat) {
                timeFormat.value = newVal
                handleChange()
            }
        })]
    }
})

export default _default