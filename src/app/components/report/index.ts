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
import ContentContainer from "../common/content-container"
import { QueryData, PaginationInfo } from "../common/constants"
import { ElLoadingService } from "element-plus"
import hostAliasService from "@service/host-alias-service"

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
    const loading = ElLoadingService({ target: `.container-card>.el-card__body`, text: "LOADING..." })
    const page = { pageSize: pageRef.size, pageNum: pageRef.num }
    const pageResult = await timerService.selectByPage(queryParam.value, page)
    const { list, total } = pageResult
    dataRef.value = list
    pageRef.total = total
    loading.close()
}

async function handleAliasChange(host: string, newAlias: string) {
    newAlias = newAlias?.trim?.()
    if (!newAlias) {
        await hostAliasService.remove(host)
    } else {
        await hostAliasService.change(host, newAlias)
    }
    dataRef.value.filter(item => item.host === host).forEach(item => item.alias = newAlias)
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
    handleAliasChange,
    whitelistRef,
    dateRangeRef,
    dataRef,
    sortRef
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

const _default = defineComponent({
    name: "Report",
    setup() {
        return () => h(ContentContainer, {}, {
            filter: () => filter(filterProps),
            content: () => [table(tableProps), pagination(paginationProps)]
        })
    }
})

export default _default
