/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { reactive, UnwrapRef, defineComponent, h, ref, Ref, computed, ComputedRef } from "vue"
import ContentContainer from "../common/content-container"
import filter, { FilterProps } from "./filter"
import Pagination, { PaginationInfo } from "../common/pagination"
import table, { TableProps } from "./table"
import { HostAliasSource } from "@entity/dao/host-alias"
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

const dialog = () => h(Modify, {
    ref: modifyDialogRef,
    onSave: queryData
})

const content = (tableProps: TableProps) => [
    table(tableProps),
    h(Pagination, {
        size: pageRef.size,
        num: pageRef.num,
        total: pageRef.total,
        onNumChange(newNum: number) {
            pageRef.num = newNum
            queryData()
        },
        onSizeChange(newSize: number) {
            pageRef.size = newSize
            queryData()
        }
    }),
    dialog()
]

export default defineComponent({
    name: "SiteManage",
    setup() {
        queryData()
        return () => h(ContentContainer, {}, {
            filter: () => filter(filterProps),
            content: () => content(tableProps)
        })
    }
})
