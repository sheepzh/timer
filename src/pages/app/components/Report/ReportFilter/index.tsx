/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import DateRangeFilterItem from "@app/components/common/DateRangeFilterItem"
import InputFilterItem from '@app/components/common/InputFilterItem'
import MultiSelectFilterItem, { type MultiSelectFilterItemInstance } from "@app/components/common/MultiSelectFilterItem"
import TimeFormatFilterItem from "@app/components/common/TimeFormatFilterItem"
import { useCategories } from "@app/context"
import { t } from "@app/locale"
import { DeleteFilled } from "@element-plus/icons-vue"
import { useState } from "@hooks"
import { type ElementDatePickerShortcut } from "@pages/element-ui/date"
import statService from "@service/stat-service"
import { containsAny } from "@util/array"
import { daysAgo } from "@util/time"
import { ElButton } from "element-plus"
import { computed, defineComponent, ref, watch, type PropType } from "vue"
import { cvtOption2Param } from "../common"
import { type ReportFilterOption } from "../context"
import { exportCsv, exportJson } from "../file-export"
import DownloadFile from "./DownloadFile"
import MergeFilterItem from "./MergeFilterItem"
import RemoteClient from "./RemoteClient"

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

const initMergeMethod = (filter: ReportFilterOption): timer.stat.MergeMethod[] => {
    const { mergeDate, siteMerge } = filter || {}
    const res: timer.stat.MergeMethod[] = []
    mergeDate && (res.push('date'))
    siteMerge && (res.push(siteMerge))
    return res.length ? res : undefined
}

const _default = defineComponent({
    props: {
        initial: Object as PropType<ReportFilterOption>,
        hideCateFilter: Boolean,
    },
    emits: {
        change: (_filterOption: ReportFilterOption) => true,
        batchDelete: (_filterOption: ReportFilterOption) => true,
    },
    setup(props, ctx) {
        const { categories } = useCategories()

        const initial: ReportFilterOption = props.initial
        const [host, setHost] = useState(initial?.host)
        const [dateRange, setDateRange] = useState(initial?.dateRange)
        const [mergeMethod, setMergeMethod] = useState(initMergeMethod(props.initial))
        const [cateIds, setCateIds] = useState(initial.cateIds)
        const [timeFormat, setTimeFormat] = useState(initial?.timeFormat)
        // Whether to read remote backup data
        const [readRemote, setReadRemote] = useState(initial?.readRemote)
        const cateSelect = ref<MultiSelectFilterItemInstance>()

        const option = computed(() => ({
            host: host.value,
            dateRange: dateRange.value,
            mergeDate: mergeMethod.value?.includes?.('date'),
            siteMerge: (['domain', 'cate'] satisfies ReportFilterOption['siteMerge'][])
                .filter(t => mergeMethod.value?.includes?.(t))
                ?.[0],
            timeFormat: timeFormat.value,
            readRemote: readRemote.value,
            cateIds: cateIds.value,
        } satisfies ReportFilterOption))

        watch(option, () => ctx.emit("change", option.value))

        watch(mergeMethod, () => mergeMethod.value?.includes('domain') && cateSelect.value?.updateValue?.([]))

        const handleDownload = async (format: FileFormat) => {
            const optionVal = option.value
            const categoriesVal = categories.value
            const param = cvtOption2Param(optionVal)
            const rows = await statService.select(param, true)
            format === 'json' && exportJson(optionVal, rows, categoriesVal)
            format === 'csv' && exportCsv(optionVal, rows, categoriesVal)
        }

        return () => <>
            <InputFilterItem placeholder="URL + ↵" onSearch={setHost} />
            <DateRangeFilterItem
                startPlaceholder={t(msg => msg.calendar.label.startDate)}
                endPlaceholder={t(msg => msg.calendar.label.endDate)}
                disabledDate={(date: Date | number) => new Date(date) > new Date()}
                shortcuts={dateShortcuts}
                defaultRange={dateRange.value}
                onChange={setDateRange}
            />
            <MultiSelectFilterItem
                ref={cateSelect}
                historyName="cate"
                disabled={mergeMethod.value?.includes('domain')}
                placeholder={t(msg => msg.siteManage.column.cate)}
                options={categories.value?.map(cate => ({ value: cate.id, label: cate.name }))}
                defaultValue={cateIds.value}
                onChange={setCateIds}
            />
            <TimeFormatFilterItem defaultValue={timeFormat.value} onChange={setTimeFormat} />
            <MergeFilterItem defaultValue={mergeMethod.value} hideCate={props.hideCateFilter} onChange={setMergeMethod} />
            <div class="filter-item-right-group">
                <ElButton
                    style={{ display: readRemote.value ? 'none' : 'inline-flex' }}
                    class="batch-delete-button"
                    disabled={containsAny(mergeMethod.value, ['cate', 'domain'])}
                    type="primary"
                    link
                    icon={<DeleteFilled />}
                    onClick={() => ctx.emit("batchDelete", option.value)}
                >
                    {t(msg => msg.button.batchDelete)}
                </ElButton>
                <RemoteClient onChange={setReadRemote} />
                <DownloadFile onDownload={handleDownload} />
            </div>
        </>
    }
})

export default _default