/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { reactive, UnwrapRef, defineComponent, h, ref, Ref, computed, ComputedRef, VNode } from "vue"
import { contentContainerCardStyle, renderContentContainer } from "../common/content-container"
import filter, { FilterProps } from "./filter"
import pagination, { PaginationProps } from "../common/pagination"
import { ElCard } from "element-plus"
import table, { TableProps } from "./table"
import { HostAliasSource } from "@entity/dao/host-alias"
import { PaginationInfo } from "../common/constants"
import hostAliasService, { HostAliasQueryParam } from "@service/host-alias-service"
import { HostAliasInfo } from "@entity/dto/host-alias-info"
import Modify from './modify'

const hostRef: Ref<string> = ref()
const aliasRef: Ref<string> = ref()
const sourceRef: Ref<HostAliasSource> = ref()
const dataRef: Ref<HostAliasInfo[]> = ref([])
const modifyDialogRef: Ref = ref()

const queryParam: ComputedRef<HostAliasQueryParam> = computed(() => {
    return {
        host: hostRef.value,
        alias: aliasRef.value,
        source: sourceRef.value
    }
})

async function queryData() {
    const page = { pageSize: pageRef.size, pageNum: pageRef.num }
    const pageResult = await hostAliasService.selectByPage(queryParam.value, page)
    const { list, total } = pageResult
    dataRef.value = list
    pageRef.total = total
}

const handleDelete = (row: HostAliasInfo) => hostAliasService.remove(row.host)
const handleModify = async (row: HostAliasInfo) => modifyDialogRef.value.modify(row)

const handleAdd = async () => modifyDialogRef.value.add()

const tableProps: TableProps = { dataRef, queryData, handleDelete, handleModify }
const filterProps: FilterProps = { hostRef, aliasRef, sourceRef, queryData, handleAdd }

const pageRef: UnwrapRef<PaginationInfo> = reactive({
    size: 10,
    num: 1,
    total: 0
})

const paginationProps: PaginationProps = { queryData, pageRef }

const dialog = () => h(Modify, {
    ref: modifyDialogRef,
    onSaved: queryData
})

const tableCard = (tableProps: TableProps, paginationProps: PaginationProps) => h(ElCard,
    contentContainerCardStyle,
    () => [
        table(tableProps),
        pagination(paginationProps),
        dialog()
    ]
)

const childNodes = () => [filter(filterProps), tableCard(tableProps, paginationProps)]

export default defineComponent(() => {
    queryData()
    return renderContentContainer(() => childNodes())
})
