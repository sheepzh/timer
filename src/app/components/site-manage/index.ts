/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref, UnwrapRef, ComputedRef, WritableComputedRef } from "vue"

import { reactive, defineComponent, h, ref, computed, } from "vue"
import ContentContainer from "../common/content-container"
import SiteManageFilter from "./filter"
import Pagination from "../common/pagination"
import SiteManageTable from "./table"
import hostAliasService, { HostAliasQueryParam } from "@service/host-alias-service"
import Modify from './modify'

export default defineComponent({
    name: "SiteManage",
    setup() {
        const hostRef: Ref<string> = ref()
        const aliasRef: Ref<string> = ref()
        const sourceRef: Ref<timer.site.AliasSource> = ref()
        const onlyDetectedRef: WritableComputedRef<boolean> = computed({
            get: () => sourceRef.value == 'DETECTED',
            set: (val: boolean) => sourceRef.value = val ? 'DETECTED' : undefined
        })
        const dataRef: Ref<timer.site.AliasIcon[]> = ref([])
        const modifyDialogRef: Ref = ref()

        const pageRef: UnwrapRef<timer.common.Pagination> = reactive({
            size: 10,
            num: 1,
            total: 0
        })

        const queryParam: ComputedRef<HostAliasQueryParam> = computed(() => ({
            host: hostRef.value,
            alias: aliasRef.value,
            source: sourceRef.value
        })
        )

        async function queryData() {
            const page = { size: pageRef.size, num: pageRef.num }
            const pageResult = await hostAliasService.selectByPage(queryParam.value, page)
            const { list, total } = pageResult
            dataRef.value = list
            pageRef.total = total
        }

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
            content: () => [
                h(SiteManageTable, {
                    data: dataRef.value,
                    onRowModify: async (row: timer.site.AliasIcon) => modifyDialogRef.value.modify(row),
                    onRowDelete: async (row: timer.site.AliasIcon) => {
                        await hostAliasService.remove(row)
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
                h(Modify, {
                    ref: modifyDialogRef,
                    onSave: queryData
                })
            ]
        })
    }
})
