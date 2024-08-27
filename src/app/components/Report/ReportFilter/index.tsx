/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ElementDatePickerShortcut } from "@src/element-ui/date"

import DownloadFile from "./DownloadFile"
import RemoteClient from "./RemoteClient"
import { watch, defineComponent, computed, type PropType } from "vue"
import { t } from "@app/locale"
import InputFilterItem from '@app/components/common/InputFilterItem'
import SwitchFilterItem from "@app/components/common/SwitchFilterItem"
import TimeFormatFilterItem from "@app/components/common/TimeFormatFilterItem"
import DateRangeFilterItem from "@app/components/common/DateRangeFilterItem"
import { daysAgo } from "@util/time"
import { ElButton } from "element-plus"
import { DeleteFilled } from "@element-plus/icons-vue"
import { useState } from "@hooks"
import { ReportFilterOption } from "../context"
import { exportCsv, exportJson } from "../file-export"
import statService from "@service/stat-service"
import { cvtOption2Param } from "../common"

function datePickerShortcut(text: string, agoOfStart?: number, agoOfEnd?: number): ElementDatePickerShortcut {
    const value = daysAgo(agoOfStart || 0, agoOfEnd || 0)
    return { text, value }
}

const dateShortcuts: ElementDatePickerShortcut[] = [
    datePickerShortcut(t(msg => msg.calendar.range.today)),
    datePickerShortcut(t(msg => msg.calendar.range.yesterday), 1, 1),
    datePickerShortcut(t(msg => msg.calendar.range.lastDays, { n: 7 }), 7),
    datePickerShortcut(t(msg => msg.calendar.range.lastDays, { n: 30 }), 30),
    datePickerShortcut(t(msg => msg.calendar.range.lastDays, { n: 60 }), 60),
]
const handleDownload = async (format: FileFormat, option: ReportFilterOption) => {
    const param = cvtOption2Param(option)
    const rows = await statService.select(param, true)
    format === 'json' && exportJson(option, rows)
    format === 'csv' && exportCsv(option, rows)
}

const _default = defineComponent({
    props: {
        initial: Object as PropType<ReportFilterOption>
    },
    emits: {
        change: (_filterOption: ReportFilterOption) => true,
        batchDelete: (_filterOption: ReportFilterOption) => true,
    },
    setup(props, ctx) {
        const initial: ReportFilterOption = props.initial
        const [host, setHost] = useState(initial?.host)
        const [dateRange, setDateRange] = useState<[Date, Date]>(initial?.dateRange)
        const [mergeDate, setMergeDate] = useState(initial?.mergeDate)
        const [mergeHost, setMergeHost] = useState(initial?.mergeHost)
        const [timeFormat, setTimeFormat] = useState(initial?.timeFormat)
        // Whether to read remote backup data
        const [readRemote, setReadRemote] = useState(initial?.readRemote)
        const option = computed(() => ({
            host: host.value,
            dateRange: dateRange.value,
            mergeDate: mergeDate.value,
            mergeHost: mergeHost.value,
            timeFormat: timeFormat.value,
            readRemote: readRemote.value,
        } as ReportFilterOption))

        watch(option, () => ctx.emit("change", option.value))

        return () => <>
            <InputFilterItem placeholder={t(msg => msg.report.hostPlaceholder)} onSearch={setHost} />
            <DateRangeFilterItem
                startPlaceholder={t(msg => msg.calendar.label.startDate)}
                endPlaceholder={t(msg => msg.calendar.label.endDate)}
                disabledDate={(date: Date | number) => new Date(date) > new Date()}
                shortcuts={dateShortcuts}
                defaultRange={dateRange.value}
                onChange={setDateRange}
            />
            <TimeFormatFilterItem defaultValue={timeFormat.value} onChange={setTimeFormat} />
            <SwitchFilterItem
                historyName="mergeDate"
                label={t(msg => msg.report.mergeDate)}
                defaultValue={mergeDate.value}
                onChange={setMergeDate}
            />
            <SwitchFilterItem
                historyName="mergeHost"
                label={t(msg => msg.report.mergeDomain)}
                defaultValue={mergeHost.value}
                onChange={setMergeHost}
            />
            <div class="filter-item-right-group">
                <ElButton
                    style={{ display: readRemote.value ? 'none' : 'inline-flex' }}
                    class="batch-delete-button"
                    disabled={mergeHost.value}
                    type="primary"
                    link
                    icon={<DeleteFilled />}
                    onClick={() => ctx.emit("batchDelete", option.value)}
                >
                    {t(msg => msg.report.batchDelete.buttonText)}
                </ElButton>
                <RemoteClient onChange={setReadRemote} />
                <DownloadFile onDownload={format => handleDownload(format, option.value)} />
            </div>
        </>
    }
})

export default _default