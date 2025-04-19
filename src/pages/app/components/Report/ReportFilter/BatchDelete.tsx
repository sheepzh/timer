import { type I18nKey, t } from "@app/locale"
import StatDatabase from "@db/stat-database"
import { DeleteFilled } from "@element-plus/icons-vue"
import statService from "@service/stat-service"
import { groupBy, sum } from "@util/array"
import { formatTime } from "@util/time"
import { ElButton, ElMessage, ElMessageBox } from "element-plus"
import { defineComponent } from "vue"
import { useReportComponent, useReportFilter } from "../context"
import type { DisplayComponent, ReportFilterOption } from "../types"

const statDatabase = new StatDatabase(chrome.storage.local)

async function computeBatchDeleteMsg(selected: timer.stat.Row[], mergeDate: boolean, dateRange: [Date, Date] | undefined): Promise<string> {
    // host => total focus
    const hostFocus: { [host: string]: number } = groupBy(selected,
        a => a.siteKey?.host,
        grouped => grouped.map(a => a.focus).reduce((a, b) => a + b, 0)
    )
    const hosts = Object.keys(hostFocus)
    if (!hosts.length) {
        // Never happen
        return t(msg => msg.report.batchDelete.noSelectedMsg)
    }
    const count2Delete: number = mergeDate
        // All the items
        ? sum(await Promise.all(Array.from(hosts).map(host => statService.count({ host, fullHost: true, date: dateRange }))))
        // The count of row
        : selected?.length || 0
    const i18nParam: Record<string, string | number | undefined> = {
        // count
        count: count2Delete,
        // example for hosts
        example: hosts[0],
        // Start date, if range
        start: undefined,
        // End date, if range
        end: undefined,
        // Date, if single date
        date: undefined,
    }

    let key: I18nKey | undefined = undefined
    const hasDateRange = dateRange?.length === 2 && (dateRange[0] || dateRange[1])
    if (!hasDateRange) {
        // Delete all
        key = msg => msg.report.batchDelete.confirmMsgAll
    } else {
        const dateFormat = t(msg => msg.calendar.dateFormat)
        const startDate = dateRange[0]
        const endDate = dateRange[1]
        const start = formatTime(startDate, dateFormat)
        const end = formatTime(endDate, dateFormat)
        if (start === end) {
            // Single date
            key = msg => msg.report.batchDelete.confirmMsg
            i18nParam.date = start
        } else {
            // Date range
            key = msg => msg.report.batchDelete.confirmMsgRange
            i18nParam.start = start
            i18nParam.end = end
        }
    }
    return t(key, i18nParam)
}

async function handleBatchDelete(displayComp: DisplayComponent | undefined, filter: ReportFilterOption) {
    if (!displayComp) return

    const selected: timer.stat.Row[] = displayComp?.getSelected?.() || []
    if (!selected?.length) {
        ElMessage.info(t(msg => msg.report.batchDelete.noSelectedMsg))
        return
    }
    const { dateRange, mergeDate } = filter
    ElMessageBox({
        message: await computeBatchDeleteMsg(selected, mergeDate, dateRange),
        type: "warning",
        confirmButtonText: t(msg => msg.button.okey),
        showCancelButton: true,
        cancelButtonText: t(msg => msg.button.dont),
        // Cant close this on press ESC
        closeOnPressEscape: false,
        // Cant close this on clicking modal
        closeOnClickModal: false
    }).then(async () => {
        // Delete
        await deleteBatch(selected, mergeDate, dateRange)
        ElMessage.success(t(msg => msg.operation.successMsg))
        displayComp?.refresh?.()
    }).catch(() => {
        // Do nothing
    })
}

async function deleteBatch(selected: timer.stat.Row[], mergeDate: boolean, dateRange: [Date, Date] | undefined) {
    if (mergeDate) {
        // Delete according to the date range
        const start = dateRange?.[0]
        const end = dateRange?.[1]
        const hosts = selected.map(d => d.siteKey?.host)
        await Promise.all(hosts.map(async h => h && await statDatabase.deleteByUrlBetween(h, start, end)))
    } else {
        // If not merge date, batch delete
        await statService.batchDelete(selected)
    }
}

const BatchDelete = defineComponent(() => {
    const filter = useReportFilter()
    const comp = useReportComponent()

    return () => (
        <ElButton
            v-show={!filter.readRemote}
            disabled={!!filter.siteMerge}
            type="primary"
            link
            icon={<DeleteFilled />}
            onClick={() => handleBatchDelete(comp.value, filter)}
        >
            {t(msg => msg.button.batchDelete)}
        </ElButton>
    )
})

export default BatchDelete