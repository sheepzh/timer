/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref, UnwrapRef, ComputedRef } from "vue"
import type { TimerQueryParam } from "@service/timer-service"
import type { SortInfo } from "./table"
import type { FileFormat } from "./filter/download-file"
import type { Router, RouteLocation } from "vue-router"

import { computed, defineComponent, h, reactive, ref } from "vue"
import { I18nKey, t } from "@app/locale"
import timerService, { SortDirect } from "@service/timer-service"
import whitelistService from "@service/whitelist-service"
import './styles/element'
import ReportTable, { ElSortDirect } from "./table"
import ReportFilter from "./filter"
import Pagination from "../common/pagination"
import ContentContainer from "../common/content-container"
import { ElLoadingService, ElMessage, ElMessageBox } from "element-plus"
import hostAliasService from "@service/host-alias-service"
import { exportCsv, exportJson } from "./file-export"
import { useRoute, useRouter } from "vue-router"
import { groupBy, sum } from "@util/array"
import { formatTime } from "@util/time"
import TimerDatabase from "@db/timer-database"
import { IS_SAFARI } from "@util/constant/environment"

const timerDatabase = new TimerDatabase(chrome.storage.local)

async function queryData(
    queryParam: Ref<TimerQueryParam>,
    data: Ref<timer.stat.Row[]>,
    page: UnwrapRef<timer.common.Pagination>,
    readRemote: Ref<boolean>
) {
    const loading = ElLoadingService({ target: `.container-card>.el-card__body`, text: "LOADING..." })
    const pageInfo = { size: page.size, num: page.num }
    const fillFlag = { alias: true, iconUrl: !IS_SAFARI }
    const param = {
        ...queryParam.value,
        inclusiveRemote: readRemote.value
    }
    const pageResult = await timerService.selectByPage(param, pageInfo, fillFlag)
    const { list, total } = pageResult
    data.value = list
    page.total = total
    loading.close()
}

async function handleAliasChange(key: timer.site.AliasKey, newAlias: string, data: Ref<timer.stat.Row[]>) {
    newAlias = newAlias?.trim?.()
    if (!newAlias) {
        await hostAliasService.remove(key)
    } else {
        await hostAliasService.change(key, newAlias)
    }
    data.value
        .filter(item => item.host === key.host)
        .forEach(item => item.alias = newAlias)
}

async function queryWhiteList(whitelist: Ref<string[]>): Promise<void> {
    const value = await whitelistService.listAll()
    whitelist.value = value
}

async function computeBatchDeleteMsg(selected: timer.stat.Row[], mergeDate: boolean, dateRange: Date[]): Promise<string> {
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
        ? sum(await Promise.all(Array.from(hosts).map(host => timerService.count({ host, fullHost: true, date: dateRange }))))
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

async function handleBatchDelete(tableEl: Ref, filterOption: timer.app.report.FilterOption, afterDelete: Function) {
    const selected: timer.stat.Row[] = tableEl?.value?.getSelected?.() || []
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

async function deleteBatch(selected: timer.stat.Row[], mergeDate: boolean, dateRange: Date[]) {
    if (!mergeDate) {
        // If not merge date
        // Delete batch
        await timerDatabase.delete(selected)
    } else {
        // Delete according to the date range
        const start = dateRange?.[0]
        const end = dateRange?.[1]
        await Promise.all(selected.map(d => timerDatabase.deleteByUrlBetween(d.host, start, end)))
    }
}

/**
 * Init the query parameters
 */
function initQueryParam(route: RouteLocation, router: Router): [timer.app.report.FilterOption, SortInfo] {
    const routeQuery: timer.app.report.QueryParam = route.query as unknown as timer.app.report.QueryParam
    const { mh, ds, de, sc } = routeQuery
    const dateStart = ds ? new Date(Number.parseInt(ds)) : undefined
    const dateEnd = ds ? new Date(Number.parseInt(de)) : undefined
    // Remove queries
    router.replace({ query: {} })

    const now = new Date()
    const filterOption: timer.app.report.FilterOption = {
        host: '',
        dateRange: [dateStart || now, dateEnd || now],
        mergeDate: false,
        mergeHost: mh === "true" || mh === "1",
        timeFormat: "default"
    }
    const sortInfo: SortInfo = {
        prop: sc || 'focus',
        order: ElSortDirect.DESC
    }
    return [filterOption, sortInfo]
}

function computeTimerQueryParam(filterOption: timer.app.report.FilterOption, sort: SortInfo): TimerQueryParam {
    return {
        host: filterOption.host,
        date: filterOption.dateRange,
        mergeHost: filterOption.mergeHost,
        mergeDate: filterOption.mergeDate,
        sort: sort.prop,
        sortOrder: sort.order === ElSortDirect.ASC ? SortDirect.ASC : SortDirect.DESC
    }
}

function copyFilterParam(newVal: timer.app.report.FilterOption, oldVal: timer.app.report.FilterOption) {
    oldVal.host = newVal.host
    oldVal.dateRange = newVal.dateRange
    oldVal.mergeDate = newVal.mergeDate
    oldVal.mergeHost = newVal.mergeHost
    oldVal.timeFormat = newVal.timeFormat
}

const _default = defineComponent({
    name: "Report",
    setup() {
        const route = useRoute()
        const router = useRouter()
        const [initialFilterParam, initialSort] = initQueryParam(route, router)
        const filterOption: UnwrapRef<timer.app.report.FilterOption> = reactive(initialFilterParam)
        const sort: UnwrapRef<SortInfo> = reactive(initialSort)

        const data: Ref<timer.stat.Row[]> = ref([])
        const whitelist: Ref<Array<string>> = ref([])
        const remoteRead: Ref<boolean> = ref(false)

        const page: UnwrapRef<timer.common.Pagination> = reactive({ size: 10, num: 1, total: 0 })
        const queryParam: ComputedRef<TimerQueryParam> = computed(() => computeTimerQueryParam(filterOption, sort))
        const tableEl: Ref = ref()

        const query = () => queryData(queryParam, data, page, remoteRead)
        // Init first
        queryWhiteList(whitelist).then(query)

        return () => h(ContentContainer, {}, {
            filter: () => h(ReportFilter, {
                host: filterOption.host,
                dateRange: filterOption.dateRange,
                mergeDate: filterOption.mergeDate,
                mergeHost: filterOption.mergeHost,
                timeFormat: filterOption.timeFormat,
                onChange: (newFilterOption: timer.app.report.FilterOption) => {
                    copyFilterParam(newFilterOption, filterOption)
                    query()
                },
                onDownload: async (format: FileFormat) => {
                    const rows = await timerService.select(queryParam.value, { alias: true })
                    format === 'json' && exportJson(filterOption, rows)
                    format === 'csv' && exportCsv(filterOption, rows)
                },
                onBatchDelete: (filterOption: timer.app.report.FilterOption) => handleBatchDelete(tableEl, filterOption, query),
                onRemoteChange(newRemoteChange) {
                    remoteRead.value = newRemoteChange
                    query()
                },
            }),
            content: () => [
                h(ReportTable, {
                    whitelist: whitelist.value,
                    mergeDate: filterOption.mergeDate,
                    mergeHost: filterOption.mergeHost,
                    timeFormat: filterOption.timeFormat,
                    dateRange: filterOption.dateRange,
                    data: data.value,
                    defaultSort: sort,
                    ref: tableEl,
                    onSortChange: ((sortInfo: SortInfo) => {
                        sort.order = sortInfo.order
                        sort.prop = sortInfo.prop
                        query()
                    }),
                    onItemDelete: (_deleted: timer.stat.Row) => query(),
                    onWhitelistChange: (_host: string, _addOrRemove: boolean) => queryWhiteList(whitelist),
                    onAliasChange: (host: string, newAlias: string) => handleAliasChange({ host, merged: filterOption.mergeHost }, newAlias, data)
                }),
                h(Pagination, {
                    total: page.total,
                    size: page.size,
                    num: page.num,
                    onNumChange(newNum: number) {
                        page.num = newNum
                        query()
                    },
                    onSizeChange(newSize: number) {
                        page.size = newSize
                        query()
                    }
                })
            ]
        })
    }
})

export default _default
