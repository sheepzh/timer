/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref, PropType } from "vue"
import type { ElementDatePickerShortcut } from "@src/element-ui/date"
import type { CalendarMessage } from "@i18n/message/common/calendar"

import DownloadFile from "./download-file"
import RemoteClient from "./remote-client"
import { h, defineComponent, ref, } from "vue"
import { t } from "@app/locale"
import InputFilterItem from '@app/components/common/input-filter-item'
import SwitchFilterItem from "@app/components/common/switch-filter-item"
import SelectFilterItem from "@app/components/common/select-filter-item"
import DateRangeFilterItem from "@app/components/common/date-range-filter-item"
import { daysAgo } from "@util/time"
import { ElButton } from "element-plus"
import { DeleteFilled } from "@element-plus/icons-vue"
import statService from "@service/stat-service"

const hostPlaceholder = t(msg => msg.report.hostPlaceholder)
const mergeDateLabel = t(msg => msg.report.mergeDate)
const mergeHostLabel = t(msg => msg.report.mergeDomain)
const timeFormatLabels: { [key in timer.app.TimeFormat]: string } = {
    "default": t(msg => msg.timeFormat.default),
    "second": t(msg => msg.timeFormat.second),
    "minute": t(msg => msg.timeFormat.minute),
    "hour": t(msg => msg.timeFormat.hour)
}
// Batch Delete
const batchDeleteButtonText = t(msg => msg.report.batchDelete.buttonText)
// Date range
const dateStartPlaceholder = t(msg => msg.calendar.label.startDate)
const dateEndPlaceholder = t(msg => msg.calendar.label.endDate)
// date range
function datePickerShortcut(msg: keyof CalendarMessage['range'], agoOfStart?: number, agoOfEnd?: number): ElementDatePickerShortcut {
    const text = t(messages => messages.calendar.range[msg])
    const value = daysAgo(agoOfStart || 0, agoOfEnd || 0)
    return { text, value }
}

const dateShortcuts: ElementDatePickerShortcut[] = [
    datePickerShortcut('today'),
    datePickerShortcut('yesterday', 1, 1),
    datePickerShortcut('last7Days', 7),
    datePickerShortcut('last30Days', 30),
    datePickerShortcut('last60Days', 60),
]

const _default = defineComponent({
    name: "ReportFilter",
    props: {
        host: String,
        dateRange: Object as PropType<[Date, Date]>,
        mergeDate: Boolean,
        mergeHost: Boolean,
        timeFormat: String as PropType<timer.app.TimeFormat>
    },
    emits: {
        change: (_filterOption: ReportFilterOption) => true,
        download: (_format: FileFormat) => true,
        batchDelete: (_filterOption: ReportFilterOption) => true,
        remoteChange: (_readRemote: boolean) => true,
    },
    setup(props, ctx) {
        const host: Ref<string> = ref(props.host)
        const dateRange: Ref<[Date, Date]> = ref(props.dateRange)
        const mergeDate: Ref<boolean> = ref(props.mergeDate)
        const mergeHost: Ref<boolean> = ref(props.mergeHost)
        const timeFormat: Ref<timer.app.TimeFormat> = ref(props.timeFormat)
        const remoteSwitchVisible: Ref<boolean> = ref(false)
        // Whether to read remote backup data
        const readRemote: Ref<boolean> = ref(false)
        const computeOption = () => ({
            host: host.value,
            dateRange: dateRange.value,
            mergeDate: mergeDate.value,
            mergeHost: mergeHost.value,
            timeFormat: timeFormat.value
        } as ReportFilterOption)
        const handleChange = () => ctx.emit("change", computeOption())
        statService.canReadRemote().then(abled => remoteSwitchVisible.value = abled)
        return () => [
            h(InputFilterItem, {
                placeholder: hostPlaceholder,
                onSearch(searchVal: string) {
                    host.value = searchVal
                    handleChange()
                },
            }),
            h(DateRangeFilterItem, {
                startPlaceholder: dateStartPlaceholder,
                endPlaceholder: dateEndPlaceholder,
                disabledDate: (date: Date | number) => new Date(date) > new Date(),
                shortcuts: dateShortcuts,
                defaultRange: dateRange.value,
                onChange(newVal: [Date, Date]) {
                    dateRange.value = newVal
                    handleChange()
                }
            }),
            h(SelectFilterItem, {
                historyName: 'timeFormat',
                defaultValue: timeFormat.value,
                options: timeFormatLabels,
                onSelect(newVal: timer.app.TimeFormat) {
                    timeFormat.value = newVal
                    handleChange()
                }
            }),
            h(SwitchFilterItem, {
                historyName: 'mergeDate',
                label: mergeDateLabel,
                defaultValue: mergeDate.value,
                onChange(newVal: boolean) {
                    mergeDate.value = newVal
                    handleChange()
                }
            }),
            h(SwitchFilterItem, {
                historyName: 'mergeHost',
                label: mergeHostLabel,
                defaultValue: mergeHost.value,
                onChange(newVal: boolean) {
                    mergeHost.value = newVal
                    handleChange()
                }
            }),
            // Float right
            h("div", { class: "filter-item-right-group" }, [
                h(ElButton, {
                    style: readRemote.value ? { display: 'none' } : { display: 'inline-flex' },
                    class: "batch-delete-button",
                    disabled: mergeHost.value,
                    type: "primary",
                    link: true,
                    icon: DeleteFilled,
                    onClick: () => ctx.emit("batchDelete", computeOption())
                }, () => batchDeleteButtonText),
                h(RemoteClient, {
                    visible: remoteSwitchVisible.value,
                    onChange: newVal => {
                        readRemote.value = newVal
                        ctx.emit('remoteChange', readRemote.value)
                    }
                }),
                h(DownloadFile, {
                    onDownload: (format: FileFormat) => ctx.emit("download", format)
                })
            ])
        ]
    }
})

export default _default