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
import { t } from "@app/locale"
import DataItem from "@entity/dto/data-item"
import timerService, { SortDirect } from "@service/timer-service"
import whitelistService from "@service/whitelist-service"
import { formatTime } from "@util/time"
import './styles/element'
import ReportTable, { ElSortDirect } from "./table"
import ReportFilter from "./filter"
import Pagination from "../common/pagination"
import ContentContainer from "../common/content-container"
import { ElLoadingService } from "element-plus"
import hostAliasService from "@service/host-alias-service"
import { exportCsv, exportJson } from "@util/file"
import { periodFormatter } from "./formatter"
import { useRoute, useRouter } from "vue-router"

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
const generateJsonData = (rows: DataItem[]) => {
    return rows.map(row => {
        const data: _ExportInfo = { host: row.host }
        data.date = row.date
        data.alias = row.alias
        // Always display by seconds
        data.total = periodFormatter(row.total, true, true)
        data.focus = periodFormatter(row.focus, true, true)
        data.time = row.time
        return data
    })
}

/** 
 * @param rows row data
 * @returns data with csv format
 */
const generateCsvData = (rows: DataItem[], mergeDate: boolean, mergeHost: boolean) => {
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
