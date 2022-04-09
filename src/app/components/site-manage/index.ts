/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { reactive, UnwrapRef, defineComponent, h, ref, Ref, computed, ComputedRef, WritableComputedRef } from "vue"
import ContentContainer from "../common/content-container"
import SiteManageFilter, { SiteManageFilterOption } from "./filter"
import Pagination, { PaginationInfo } from "../common/pagination"
import SiteManageTable from "./table"
import { HostAliasSource } from "@entity/dao/host-alias"
import hostAliasService, { HostAliasQueryParam } from "@service/host-alias-service"
import { HostAliasInfo } from "@entity/dto/host-alias-info"
import Modify from './modify'

const hostRef: Ref<string> = ref()
const aliasRef: Ref<string> = ref()
const sourceRef: Ref<HostAliasSource> = ref()
const onlyDetectedRef: WritableComputedRef<boolean> = computed({
    get: () => sourceRef.value == HostAliasSource.DETECTED,
    set: (val: boolean) => sourceRef.value = val ? HostAliasSource.DETECTED : undefined
})
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

const pageRef: UnwrapRef<PaginationInfo> = reactive({
    size: 10,
    num: 1,
    total: 0
})

const dialog = () => h(Modify, {
    ref: modifyDialogRef,
    onSave: queryData
})

const content = () => [
    h(SiteManageTable, {
        data: dataRef.value,
        onRowModify: async (row: HostAliasInfo) => modifyDialogRef.value.modify(row),
        onRowDelete: async (row: HostAliasInfo) => {
            await hostAliasService.remove(row.host)
            queryData()
        }
    }),
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
            filter: () => h(SiteManageFilter, {
                host: hostRef.value,
                alias: aliasRef.value,
                onlyDetected: onlyDetectedRef.value,
                onChange(option: SiteManageFilterOption) {
                    hostRef.value = option.host
                    aliasRef.value = option.alias
                    onlyDetectedRef.value = option.onlyDetected
                    queryData()
                },
                onCreate() {
                    modifyDialogRef.value.add?.()
                }
            }),
            content: () => content()
        })
    }
})
