/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { FileFormat } from "./download-file"
import type { Ref, PropType } from "vue"
import type { ElementDatePickerShortcut } from "@app/element-ui/date"
import type { ReportMessage } from "@app/locale/components/report"

import DownloadFile from "./download-file"
import { h, defineComponent, ref, } from "vue"
import { t } from "@app/locale"
import InputFilterItem from '@app/components/common/input-filter-item'
import SwitchFilterItem from "@app/components/common/switch-filter-item"
import DateRangeFilterItem from "@app/components/common/date-range-filter-item"
import { daysAgo } from "@util/time"
import { ElButton } from "element-plus"
import { DeleteFilled } from "@element-plus/icons-vue"

const hostPlaceholder = t(msg => msg.report.hostPlaceholder)
const mergeDateLabel = t(msg => msg.report.mergeDate)
const mergeHostLabel = t(msg => msg.report.mergeDomain)
const displayBySecondLabel = t(msg => msg.report.displayBySecond)
// Date range
const dateStartPlaceholder = t(msg => msg.report.startDate)
const dateEndPlaceholder = t(msg => msg.report.endDate)
// date range
function datePickerShortcut(msg: keyof ReportMessage, agoOfStart?: number, agoOfEnd?: number): ElementDatePickerShortcut {
    const text = t(messages => messages.report[msg])
    const value = daysAgo(agoOfStart || 0, agoOfEnd || 0)
    return { text, value }
}

const dateShortcuts: ElementDatePickerShortcut[] = [
    datePickerShortcut('today'),
    datePickerShortcut('yesterday', 1, 1),
    datePickerShortcut('lateWeek', 7),
    datePickerShortcut('late30Days', 30)
]

export type ReportFilterOption = {
    host: string
    dateRange: Date[]
    mergeDate: boolean
    mergeHost: boolean
    displayBySecond: boolean
}

const _default = defineComponent({
    name: "ReportFilter",
    props: {
        host: String,
        dateRange: Array as PropType<Date[]>,
        mergeDate: Boolean,
        mergeHost: Boolean,
        displayBySecond: Boolean
    },
    emits: ["change", "download", "batchDelete"],
    setup(props, ctx) {
        const host: Ref<string> = ref(props.host)
        // Don't know why the error occurred, so ignore
        // @ts-ignore ts(2322)
        const dateRange: Ref<Array<Date>> = ref(props.dateRange)
        const mergeDate: Ref<boolean> = ref(props.mergeDate)
        const mergeHost: Ref<boolean> = ref(props.mergeHost)
        const displayBySecond: Ref<boolean> = ref(props.displayBySecond)
        const computeOption = () => ({
            host: host.value,
            dateRange: dateRange.value,
            mergeDate: mergeDate.value,
            mergeHost: mergeHost.value,
            displayBySecond: displayBySecond.value
        } as ReportFilterOption)
        const handleChange = () => ctx.emit("change", computeOption())
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
                onChange(newVal: Date[]) {
                    dateRange.value = newVal
                    handleChange()
                }
            }),
            h(SwitchFilterItem, {
                label: mergeDateLabel,
                defaultValue: mergeDate.value,
                onChange(newVal: boolean) {
                    mergeDate.value = newVal
                    handleChange()
                }
            }),
            h(SwitchFilterItem, {
                label: mergeHostLabel,
                defaultValue: mergeHost.value,
                onChange(newVal: boolean) {
                    mergeHost.value = newVal
                    handleChange()
                }
            }),
            h(SwitchFilterItem, {
                label: displayBySecondLabel,
                defaultValue: displayBySecond.value,
                onChange(newVal: boolean) {
                    displayBySecond.value = newVal
                    handleChange()
                }
            }),
            // Float right
            h("div", { style: { float: "right" } }, [
                h(ElButton, {
                    class: "batch-delete-button",
                    disabled: mergeHost.value,
                    type: "text",
                    icon: DeleteFilled,
                    onClick: () => ctx.emit("batchDelete", computeOption())
                }, () => "Batch Delete"),
                h(DownloadFile, {
                    onDownload: (format: FileFormat) => ctx.emit("download", format)
                })
            ])
        ]
    }
})

export default _default