/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { computed, ComputedRef, defineComponent, h, reactive, Ref, ref, UnwrapRef } from "vue"
import { t } from "@app/locale"
import DataItem from "@entity/dto/data-item"
import timerService, { SortDirect, TimerQueryParam } from "@service/timer-service"
import whitelistService from "@service/whitelist-service"
import { formatTime } from "@util/time"
import './styles/element'
import table, { ElSortDirect, SortInfo, TableProps } from "./table"
import filter, { FilterProps } from "./filter"
import pagination, { PaginationProps } from "../common/pagination"
import { contentContainerCardStyle, renderContentContainer } from "../common/content-container"
import { QueryData, PaginationInfo } from "../common/constants"
import { useRouter } from "vue-router"
import { ElCard, ElLoadingService } from "element-plus"

const TABLE_CARD_DOM_ID = "report-table-container"

const hostRef: Ref<string> = ref('')
const now = new Date()
// Don't know why the error occurred, so ignore
// @ts-ignore ts(2322)
const dateRangeRef: Ref<Array<Date>> = ref([now, now])
const mergeDateRef: Ref<boolean> = ref(false)
const mergeHostRef: Ref<boolean> = ref(false)
const displayBySecondRef: Ref<boolean> = ref(false)
const dataRef: Ref<DataItem[]> = ref([])
const whitelistRef: Ref<Array<string>> = ref([])
const sortRef: UnwrapRef<SortInfo> = reactive({
    prop: 'focus',
    order: ElSortDirect.DESC
})
const pageRef: UnwrapRef<PaginationInfo> = reactive({
    size: 10,
    num: 1,
    total: 0
})

const queryParam: ComputedRef<TimerQueryParam> = computed(() => {
    return {
        host: hostRef.value,
        date: dateRangeRef.value,
        mergeHost: mergeHostRef.value,
        mergeDate: mergeDateRef.value,
        sort: sortRef.prop,
        sortOrder: sortRef.order === ElSortDirect.ASC ? SortDirect.ASC : SortDirect.DESC
    }
})

const exportFileName = computed(() => {
    let baseName = t(msg => msg.report.exportFileName)
    const dateRange = dateRangeRef.value
    if (dateRange && dateRange.length === 2) {
        const start = dateRange[0]
        const end = dateRange[1]
        baseName += '_' + formatTime(start, '{y}{m}{d}')
        baseName += '_' + formatTime(end, '{y}{m}{d}')
    }
    mergeDateRef.value && (baseName += '_' + t(msg => msg.report.mergeDate))
    mergeHostRef.value && (baseName += '_' + t(msg => msg.report.mergeDomain))
    displayBySecondRef.value && (baseName += '_' + t(msg => msg.report.displayBySecond))
    return baseName
})

const queryData: QueryData = async () => {
    const loading = ElLoadingService({ target: `#${TABLE_CARD_DOM_ID}`, text: "LOADING..." })
    const page = { pageSize: pageRef.size, pageNum: pageRef.num }
    const pageResult = await timerService.selectByPage(queryParam.value, page)
    const { list, total } = pageResult
    dataRef.value = list
    pageRef.total = total
    loading.close()
}

const queryWhiteList = async () => {
    const whitelist = await whitelistService.listAll()
    whitelistRef.value = whitelist
    return await Promise.resolve()
}

queryWhiteList().then(queryData)

const tableProps: TableProps = {
    mergeDateRef,
    mergeHostRef,
    displayBySecondRef,
    queryWhiteList,
    queryData,
    whitelistRef,
    dateRangeRef,
    dataRef,
    sortRef,
    router: undefined
}

const filterProps: FilterProps = {
    mergeDateRef,
    mergeHostRef,
    displayBySecondRef,
    queryData,
    dataRef,
    exportFileName,
    hostRef,
    dateRangeRef
}

const paginationProps: PaginationProps = {
    queryData,
    pageRef
}

const tableCard = (tableProps: TableProps, paginationProps: PaginationProps) => h(ElCard,
    { ...contentContainerCardStyle, id: TABLE_CARD_DOM_ID },
    () => [table(tableProps), pagination(paginationProps)]
)

const childNodes = () => [filter(filterProps), tableCard(tableProps, paginationProps)]

export default defineComponent(() => {
    const router = useRouter()
    tableProps.router = router
    return renderContentContainer(() => childNodes())
})
