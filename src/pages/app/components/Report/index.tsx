/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { type I18nKey, t } from "@app/locale"
import StatDatabase from "@db/stat-database"
import { useMediaSize, useState } from "@hooks"
import { MediaSize } from "@hooks/useMediaSize"
import statService from "@service/stat-service"
import { groupBy, sum } from "@util/array"
import { formatTime } from "@util/time"
import { ElMessage, ElMessageBox } from "element-plus"
import { computed, defineComponent, ref } from "vue"
import { type RouteLocation, type Router, useRoute, useRouter } from "vue-router"
import ContentContainer from "../common/ContentContainer"
import { initProvider } from "./context"
import ReportFilter from "./ReportFilter"
import ReportList from "./ReportList"
import ReportTable from "./ReportTable"
import './style'
import type { DisplayComponent, ReportFilterOption, ReportQueryParam, ReportSort } from "./types"

const statDatabase = new StatDatabase(chrome.storage.local)

async function computeBatchDeleteMsg(selected: timer.stat.Row[], mergeDate: boolean, dateRange: [Date, Date]): Promise<string> {
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

async function handleBatchDelete(displayComp: DisplayComponent, filterOption: ReportFilterOption) {
    const selected: timer.stat.Row[] = displayComp?.getSelected?.() || []
    if (!selected?.length) {
        ElMessage.info(t(msg => msg.report.batchDelete.noSelectedMsg))
        return
    }
    const { dateRange, mergeDate } = filterOption || {}
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

async function deleteBatch(selected: timer.stat.Row[], mergeDate: boolean, dateRange: [Date, Date]) {
    if (mergeDate) {
        // Delete according to the date range
        const start = dateRange?.[0]
        const end = dateRange?.[1]
        await Promise.all(selected.map(d => statDatabase.deleteByUrlBetween(d.siteKey.host, start, end)))
    } else {
        // If not merge date, batch delete
        await statService.batchDelete(selected)
    }
}

/**
 * Init the query parameters
 */
function initQueryParam(route: RouteLocation, router: Router): [ReportFilterOption, ReportSort] {
    const routeQuery: ReportQueryParam = route.query as unknown as ReportQueryParam
    const { mh, md, ds, de, sc } = routeQuery
    const dateStart = ds ? new Date(Number.parseInt(ds)) : undefined
    const dateEnd = ds ? new Date(Number.parseInt(de)) : undefined
    // Remove queries
    router.replace({ query: {} })

    let siteMerge: ReportFilterOption['siteMerge']
    if (mh === "true" || mh === "1") siteMerge = 'domain'

    const now = new Date()
    const filterOption: ReportFilterOption = {
        host: '',
        dateRange: [dateStart || now, dateEnd || now],
        mergeDate: md === "true" || md === "1",
        siteMerge,
        timeFormat: "default"
    }
    const sortInfo: ReportSort = {
        prop: sc || 'focus',
        order: 'descending'
    }
    return [filterOption, sortInfo]
}

const _default = defineComponent(() => {
    const route = useRoute()
    const router = useRouter()
    const [initialFilterParam, initialSort] = initQueryParam(route, router)
    const [filterOption, setFilterOption] = useState(initialFilterParam)
    initProvider(filterOption)

    const displayComp = ref<DisplayComponent>()

    const mediaSize = useMediaSize()
    const isXs = computed(() => mediaSize.value === MediaSize.xs)

    return () => <ContentContainer v-slots={{
        filter: () => (
            <ReportFilter
                initial={filterOption.value}
                onChange={setFilterOption}
                onBatchDelete={filterOption => handleBatchDelete(displayComp.value, filterOption)}
                hideCateFilter={isXs.value}
            />
        ),
        default: () => isXs.value
            ? <ReportList ref={displayComp} />
            : <ReportTable defaultSort={initialSort} ref={displayComp} />
    }} />
})

export default _default
