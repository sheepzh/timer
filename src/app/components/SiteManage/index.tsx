/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref, UnwrapRef } from "vue"

import { reactive, defineComponent, ref, watch, } from "vue"
import ContentContainer from "../common/content-container"
import SiteManageFilter from "./SiteManageFilter"
import Pagination from "../common/Pagination"
import SiteManageTable from "./SiteManageTable"
import siteService, { SiteQueryParam } from "@service/site-service"
import Modify, { ModifyInstance } from './SiteManageModify'

export default defineComponent({
    setup() {
        const filterOption: Ref<SiteManageFilterOption> = ref()
        const data: Ref<timer.site.SiteInfo[]> = ref([])
        const modify: Ref<ModifyInstance> = ref()

        const page: UnwrapRef<timer.common.Pagination> = reactive({
            size: 10,
            num: 1,
            total: 0
        })

        async function queryData() {
            const pageParam = { size: page.size, num: page.num }
            const { host, alias, onlyDetected } = filterOption.value || {}
            const param: SiteQueryParam = { host, alias, source: onlyDetected ? "DETECTED" : undefined }
            const pageResult = await siteService.selectByPage(param, pageParam)
            const { list, total } = pageResult
            data.value = list
            page.total = total
        }

        watch([() => page.size, () => page.num, filterOption], queryData)
        queryData()

        return () => <ContentContainer v-slots={{
            filter: () => <SiteManageFilter
                defaultValue={filterOption.value}
                onChange={(option: SiteManageFilterOption) => filterOption.value = option}
                onCreate={() => modify.value?.add?.()}
            />,
            content: () => <>
                <SiteManageTable data={data.value} onRowDelete={queryData} onRowModify={queryData} />
                <Pagination
                    defaultValue={[1, 10]}
                    total={page.total}
                    onChange={(currentPage, pageSize) => {
                        page.num = currentPage
                        page.size = pageSize
                    }}
                />
                <Modify ref={modify} onSave={queryData} />
            </>,
        }} />
    }
})
