/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref, PropType } from "vue"
import type { ElementDatePickerShortcut } from "@src/element-ui/date"
import type { CalendarMessage } from "@i18n/message/common/calendar"

import DownloadFile from "./DownloadFile"
import RemoteClient from "./RemoteClient"
import { watch, defineComponent, ref } from "vue"
import { t } from "@app/locale"
import InputFilterItem from '@app/components/common/input-filter-item'
import SwitchFilterItem from "@app/components/common/switch-filter-item"
import TimeFormatFilterItem from "@app/components/common/time-format-filter-item"
import DateRangeFilterItem from "@app/components/common/date-range-filter-item"
import { daysAgo } from "@util/time"
import { ElButton } from "element-plus"
import { DeleteFilled } from "@element-plus/icons-vue"

const hostPlaceholder = t(msg => msg.report.hostPlaceholder)
const mergeDateLabel = t(msg => msg.report.mergeDate)
const mergeHostLabel = t(msg => msg.report.mergeDomain)
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
    props: {
        initial: Object as PropType<ReportFilterOption>
    },
    emits: {
        change: (_filterOption: ReportFilterOption) => true,
        download: (_format: FileFormat) => true,
        batchDelete: (_filterOption: ReportFilterOption) => true,
    },
    setup(props, ctx) {
        const initial: ReportFilterOption = props.initial
        const host: Ref<string> = ref(initial?.host)
        const dateRange: Ref<[Date, Date]> = ref(initial?.dateRange)
        const mergeDate: Ref<boolean> = ref(initial?.mergeDate)
        const mergeHost: Ref<boolean> = ref(initial?.mergeHost)
        const timeFormat: Ref<timer.app.TimeFormat> = ref(initial?.timeFormat)
        // Whether to read remote backup data
        const readRemote: Ref<boolean> = ref(initial?.readRemote)
        const computeOption = () => ({
            host: host.value,
            dateRange: dateRange.value,
            mergeDate: mergeDate.value,
            mergeHost: mergeHost.value,
            timeFormat: timeFormat.value,
            readRemote: readRemote.value,
        } as ReportFilterOption)
        watch([host, dateRange, mergeDate, mergeHost, timeFormat, readRemote], () => {
            const option = computeOption()
            ctx.emit("change", option)
        })
        return () => <>
            <InputFilterItem placeholder={hostPlaceholder} onSearch={val => host.value = val} />
            <DateRangeFilterItem
                startPlaceholder={dateStartPlaceholder}
                endPlaceholder={dateEndPlaceholder}
                disabledDate={(date: Date | number) => new Date(date) > new Date()}
                shortcuts={dateShortcuts}
                defaultRange={dateRange.value}
                onChange={val => dateRange.value = val}
            />
            <TimeFormatFilterItem defaultValue={timeFormat.value} onChange={val => timeFormat.value = val} />
            <SwitchFilterItem
                historyName="mergeDate"
                label={mergeDateLabel}
                defaultValue={mergeDate.value}
                onChange={val => mergeDate.value = val}
            />
            <SwitchFilterItem
                historyName="mergeHost"
                label={mergeHostLabel}
                defaultValue={mergeHost.value}
                onChange={val => mergeHost.value = val}
            />
            <div class="filter-item-right-group">
                <ElButton
                    style={{ display: readRemote.value ? 'none' : 'inline-flex' }}
                    class="batch-delete-button"
                    disabled={mergeHost.value}
                    type="primary"
                    link
                    icon={<DeleteFilled />}
                    onClick={() => ctx.emit("batchDelete", computeOption())}
                >
                    {batchDeleteButtonText}
                </ElButton>
                <RemoteClient onChange={val => readRemote.value = val} />
                <DownloadFile onDownload={format => ctx.emit("download", format)} />
            </div>
        </>
    }
})

export default _default