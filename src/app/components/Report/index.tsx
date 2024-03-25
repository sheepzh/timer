/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref, ComputedRef } from "vue"
import type { StatQueryParam } from "@service/stat-service"
import type { Router, RouteLocation } from "vue-router"

import { computed, defineComponent, watch, ref } from "vue"
import { I18nKey, t } from "@app/locale"
import statService from "@service/stat-service"
import './styles/element'
import ReportTable, { TableInstance } from "./ReportTable"
import ReportFilter from "./ReportFilter"
import Pagination from "../common/Pagination"
import ContentContainer from "../common/content-container"
import { ElMessage, ElMessageBox } from "element-plus"
import siteService from "@service/site-service"
import { exportCsv, exportJson } from "./file-export"
import { useRoute, useRouter } from "vue-router"
import { groupBy, sum } from "@util/array"
import { formatTime } from "@util/time"
import StatDatabase from "@db/stat-database"
import { initProvider } from "./context"
import { useRequest } from "@app/hooks/useRequest"
import { useWindowVisible } from "@app/hooks/useWindowVisible"

const statDatabase = new StatDatabase(chrome.storage.local)

async function handleAliasChange(key: timer.site.SiteKey, newAlias: string, data: timer.stat.Row[]) {
    newAlias = newAlias?.trim?.()
    if (!newAlias) {
        await siteService.removeAlias(key)
    } else {
        await siteService.saveAlias(key, newAlias, 'USER')
    }
    data?.filter(item => item.host === key.host)
        ?.forEach(item => item.alias = newAlias)
}

async function computeBatchDeleteMsg(selected: timer.stat.Row[], mergeDate: boolean, dateRange: [Date, Date]): Promise<string> {
    // host => total focus
    const hostFocus: { [host: string]: number } = groupBy(selected,
        a => a.host,
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
    const i18nParam = {
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

    let key: I18nKey = undefined
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

async function handleBatchDelete(tableInstance: TableInstance, filterOption: ReportFilterOption, afterDelete: Function) {
    const selected: timer.stat.Row[] = tableInstance?.getSelected?.() || []
    if (!selected?.length) {
        ElMessage({ type: "info", message: t(msg => msg.report.batchDelete.noSelectedMsg) })
        return
    }
    ElMessageBox({
        message: await computeBatchDeleteMsg(selected, filterOption.mergeDate, filterOption.dateRange),
        type: "warning",
        confirmButtonText: t(msg => msg.confirm.confirmMsg),
        showCancelButton: true,
        cancelButtonText: t(msg => msg.confirm.cancelMsg),
        // Cant close this on press ESC
        closeOnPressEscape: false,
        // Cant close this on clicking modal
        closeOnClickModal: false
    }).then(async () => {
        // Delete
        await deleteBatch(selected, filterOption.mergeDate, filterOption.dateRange)
        ElMessage({
            type: "success",
            message: t(msg => msg.report.batchDelete.successMsg)
        })
        afterDelete?.()
    }).catch(() => {
        // Do nothing
    })
}

async function deleteBatch(selected: timer.stat.Row[], mergeDate: boolean, dateRange: [Date, Date]) {
    if (!mergeDate) {
        // If not merge date
        // Delete batch
        await statDatabase.delete(selected)
    } else {
        // Delete according to the date range
        const start = dateRange?.[0]
        const end = dateRange?.[1]
        await Promise.all(selected.map(d => statDatabase.deleteByUrlBetween(d.host, start, end)))
    }
}

/**
 * Init the query parameters
 */
function initQueryParam(route: RouteLocation, router: Router): [ReportFilterOption, SortInfo] {
    const routeQuery: ReportQueryParam = route.query as unknown as ReportQueryParam
    const { mh, ds, de, sc } = routeQuery
    const dateStart = ds ? new Date(Number.parseInt(ds)) : undefined
    const dateEnd = ds ? new Date(Number.parseInt(de)) : undefined
    // Remove queries
    router.replace({ query: {} })

    const now = new Date()
    const filterOption: ReportFilterOption = {
        host: '',
        dateRange: [dateStart || now, dateEnd || now],
        mergeDate: false,
        mergeHost: mh === "true" || mh === "1",
        timeFormat: "default"
    }
    const sortInfo: SortInfo = {
        prop: sc || 'focus',
        order: 'descending'
    }
    return [filterOption, sortInfo]
}

function computeTimerQueryParam(filterOption: ReportFilterOption, sort: SortInfo): StatQueryParam {
    return {
        host: filterOption.host,
        date: filterOption.dateRange,
        mergeHost: filterOption.mergeHost,
        mergeDate: filterOption.mergeDate,
        inclusiveRemote: filterOption.readRemote,
        sort: sort.prop,
        sortOrder: sort.order === 'ascending' ? 'ASC' : 'DESC'
    }
}

const _default = defineComponent(() => {
    const route = useRoute()
    const router = useRouter()
    const [initialFilterParam, initialSort] = initQueryParam(route, router)
    const filterOption: Ref<ReportFilterOption> = ref(initialFilterParam)
    initProvider(filterOption)
    const sort: Ref<SortInfo> = ref(initialSort)

    const page = ref<timer.common.PageQuery>({ size: 10, num: 1 })
    const queryParam: ComputedRef<StatQueryParam> = computed(() => computeTimerQueryParam(filterOption.value, sort.value))
    const table: Ref<TableInstance> = ref()
    const { data: pagination, refresh } = useRequest(
        () => statService.selectByPage(queryParam.value, page.value, true),
        { loadingTarget: ".container-card>.el-card__body" }
    )

    // Query data if window become visible
    useWindowVisible(refresh)
    watch([queryParam, page], refresh)
    const handleDownload = async (format: FileFormat) => {
        const rows = await statService.select(queryParam.value, true)
        format === 'json' && exportJson(filterOption.value, rows)
        format === 'csv' && exportCsv(filterOption.value, rows)
    }

    return () => <ContentContainer v-slots={{
        filter: () => <ReportFilter
            initial={filterOption.value}
            onChange={newVal => filterOption.value = newVal}
            onDownload={handleDownload}
            onBatchDelete={filterOption => handleBatchDelete(table.value, filterOption, refresh)}
        />,
        content: () => <>
            <ReportTable
                data={pagination.value?.list}
                defaultSort={sort.value}
                ref={table}
                onSortChange={newVal => sort.value = newVal}
                onItemDelete={refresh}
                onAliasChange={(host, newAlias) => handleAliasChange({ host, merged: filterOption.value?.mergeHost }, newAlias, pagination.value?.list)}
            />
            <Pagination
                defaultValue={page.value}
                total={pagination.value?.total || 0}
                onChange={(num, size) => page.value = { num, size }}
            />
        </>,
    }} />
})

export default _default
