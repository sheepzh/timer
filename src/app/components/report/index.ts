/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref, UnwrapRef, ComputedRef } from "vue"
import type { TimerQueryParam } from "@service/timer-service"
import type { PaginationInfo } from "../common/pagination"
import type { SortInfo } from "./table"
import type { FileFormat } from "./filter/download-file"
import type { ReportFilterOption } from "./filter"

import { computed, defineComponent, h, reactive, ref } from "vue"
import { I18nKey, t } from "@app/locale"
import DataItem from "@entity/dto/data-item"
import timerService, { SortDirect } from "@service/timer-service"
import whitelistService from "@service/whitelist-service"
import './styles/element'
import ReportTable, { ElSortDirect } from "./table"
import ReportFilter from "./filter"
import Pagination from "../common/pagination"
import ContentContainer from "../common/content-container"
import { ElLoadingService, ElMessage, ElMessageBox } from "element-plus"
import hostAliasService from "@service/host-alias-service"
import { exportCsv, exportJson } from "@util/file"
import { DISPLAY_DATE_FORMAT, periodFormatter } from "./formatter"
import { useRoute, useRouter } from "vue-router"
import { groupBy, sum } from "@util/array"
import { formatTime } from "@util/time"
import TimerDatabase from "@db/timer-database"

const timerDatabase = new TimerDatabase(chrome.storage.local)

async function queryData(queryParam: Ref<TimerQueryParam>, data: Ref<DataItem[]>, page: UnwrapRef<PaginationInfo>) {
    const loading = ElLoadingService({ target: `.container-card>.el-card__body`, text: "LOADING..." })
    const pageInfo = { pageSize: page.size, pageNum: page.num }
    const pageResult = await timerService.selectByPage(queryParam.value, pageInfo)
    const { list, total } = pageResult
    data.value = list
    page.total = total
    loading.close()
}

async function handleAliasChange(host: string, newAlias: string, data: Ref<DataItem[]>) {
    newAlias = newAlias?.trim?.()
    if (!newAlias) {
        await hostAliasService.remove(host)
    } else {
        await hostAliasService.change(host, newAlias)
    }
    data.value.filter(item => item.host === host).forEach(item => item.alias = newAlias)
}

async function queryWhiteList(whitelist: Ref<string[]>): Promise<void> {
    const value = await whitelistService.listAll()
    whitelist.value = value
}

type _ExportInfo = {
    host: string
    alias?: string
    date?: string
    total?: string
    focus?: string
    time?: number
}

/** 
 * @param rows row data
 * @returns data with json format 
 */
const generateJsonData = (rows: DataItem[]) => rows.map(row => {
    const data: _ExportInfo = { host: row.host }
    data.date = row.date
    data.alias = row.alias
    // Always display by seconds
    data.total = periodFormatter(row.total, true, true)
    data.focus = periodFormatter(row.focus, true, true)
    data.time = row.time
    return data
})

/** 
 * @param rows row data
 * @returns data with csv format
 */
function generateCsvData(rows: DataItem[], mergeDate: boolean, mergeHost: boolean): string[][] {
    const columnName: string[] = []
    if (!mergeDate) {
        columnName.push(t(msg => msg.item.date))
    }
    columnName.push(t(msg => msg.item.host))
    if (!mergeHost) {
        columnName.push(t(msg => msg.siteManage.column.alias))
    }
    columnName.push(t(msg => msg.item.total))
    columnName.push(t(msg => msg.item.focus))
    columnName.push(t(msg => msg.item.time))
    const data = [columnName]
    rows.forEach(row => {
        const line = []
        if (!mergeDate) {
            line.push(row.date)
        }
        line.push(row.host)
        if (!mergeHost) {
            line.push(row.alias || '')
        }
        line.push(periodFormatter(row.total, true, true))
        line.push(periodFormatter(row.focus, true, true))
        line.push(row.time)
        data.push(line)
    })
    return data
}

async function computeBatchDeleteMsg(selected: DataItem[], mergeDate: boolean, dateRange: Date[]): Promise<string> {
    console.log(selected)
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
        const startDate = dateRange[0]
        const endDate = dateRange[1]
        const start = formatTime(startDate, DISPLAY_DATE_FORMAT)
        const end = formatTime(endDate, DISPLAY_DATE_FORMAT)
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

async function deleteBatch(selected: DataItem[], mergeDate: boolean, dateRange: Date[]) {
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

export type ReportQuery = {
    /**
     * Merge host
     */
    mh?: string
    /**
     * Date start
     */
    ds?: string
    /**
     * Date end
     */
    de?: string
    /**
     * Sorted column
     */
    sc?: Timer.DataDimension
}

const _default = defineComponent({
    name: "Report",
    setup() {
        // Init with route query
        const routeQuery: ReportQuery = useRoute().query as unknown as ReportQuery
        const { mh, ds, de, sc } = routeQuery
        const dateStart = ds ? new Date(Number.parseInt(ds)) : undefined
        const dateEnd = ds ? new Date(Number.parseInt(de)) : undefined
        // Remove queries
        useRouter().replace({ query: {} })

        const host: Ref<string> = ref('')
        const now = new Date()
        // Don't know why the error occurred, so ignore
        // @ts-ignore ts(2322)
        const dateRange: Ref<Array<Date>> = ref([dateStart || now, dateEnd || now])
        const mergeDate: Ref<boolean> = ref(false)
        const mergeHost: Ref<boolean> = ref(mh === "true" || mh === "1")
        const displayBySecond: Ref<boolean> = ref(false)
        const data: Ref<DataItem[]> = ref([])
        const whitelist: Ref<Array<string>> = ref([])
        const sort: UnwrapRef<SortInfo> = reactive({
            prop: sc || 'focus',
            order: ElSortDirect.DESC
        })
        const page: UnwrapRef<PaginationInfo> = reactive({ size: 10, num: 1, total: 0 })
        const queryParam: ComputedRef<TimerQueryParam> = computed(() => ({
            host: host.value,
            date: dateRange.value,
            mergeHost: mergeHost.value,
            mergeDate: mergeDate.value,
            sort: sort.prop,
            sortOrder: sort.order === ElSortDirect.ASC ? SortDirect.ASC : SortDirect.DESC
        }))
        const exportFileName = computed(() => {
            let baseName = t(msg => msg.report.exportFileName)
            const dateRangeVal = dateRange.value
            if (dateRangeVal && dateRangeVal.length === 2) {
                const start = dateRangeVal[0]
                const end = dateRangeVal[1]
                baseName += '_' + formatTime(start, '{y}{m}{d}')
                baseName += '_' + formatTime(end, '{y}{m}{d}')
            }
            mergeDate.value && (baseName += '_' + t(msg => msg.report.mergeDate))
            mergeHost.value && (baseName += '_' + t(msg => msg.report.mergeDomain))
            displayBySecond.value && (baseName += '_' + t(msg => msg.report.displayBySecond))
            return baseName
        })

        const tableEl: Ref = ref()

        const query = () => queryData(queryParam, data, page)
        // Init first
        queryWhiteList(whitelist).then(query)

        return () => h(ContentContainer, {}, {
            filter: () => h(ReportFilter, {
                host: host.value,
                dateRange: dateRange.value,
                mergeDate: mergeDate.value,
                mergeHost: mergeHost.value,
                displayBySecond: displayBySecond.value,
                onChange: (newFilterOption: ReportFilterOption) => {
                    host.value = newFilterOption.host
                    dateRange.value = newFilterOption.dateRange
                    mergeDate.value = newFilterOption.mergeDate
                    mergeHost.value = newFilterOption.mergeHost
                    displayBySecond.value = newFilterOption.displayBySecond
                    query()
                },
                onDownload: async (format: FileFormat) => {
                    const rows = await timerService.select(queryParam.value, { alias: true })
                    const fileName = exportFileName.value
                    format === 'json' && exportJson(generateJsonData(rows), fileName)
                    format === 'csv' && exportCsv(generateCsvData(rows, mergeDate.value, mergeHost.value), fileName)
                },
                onBatchDelete: async (filterOption: ReportFilterOption) => {
                    const selected: DataItem[] = tableEl?.value?.getSelected?.() || []
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
                        query()
                    }).catch(() => {
                        // Do nothing
                    })
                }
            }),
            content: () => [
                h(ReportTable, {
                    whitelist: whitelist.value,
                    mergeDate: mergeDate.value,
                    mergeHost: mergeHost.value,
                    displayBySecond: displayBySecond.value,
                    dateRange: dateRange.value,
                    data: data.value,
                    defaultSort: sort,
                    ref: tableEl,
                    onSortChange: ((sortInfo: SortInfo) => {
                        sort.order = sortInfo.order
                        sort.prop = sortInfo.prop
                        query()
                    }),
                    onItemDelete: (_deleted: DataItem) => query(),
                    onWhitelistChange: (_host: string, _addOrRemove: boolean) => queryWhiteList(whitelist),
                    onAliasChange: (host: string, newAlias: string) => handleAliasChange(host, newAlias, data)
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
