/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, ref, watch, type Ref } from "vue"
import ContentContainer from "../common/content-container"
import SiteManageFilter from "./SiteManageFilter"
import Pagination from "../common/Pagination"
import SiteManageTable from "./SiteManageTable"
import siteService, { SiteQueryParam } from "@service/site-service"
import Modify, { ModifyInstance } from './SiteManageModify'
import { useRequest } from "@hooks/useRequest"

export default defineComponent(() => {
    const filterOption: Ref<SiteManageFilterOption> = ref()
    const modify: Ref<ModifyInstance> = ref()
    const page = ref<timer.common.PageQuery>({ num: 1, size: 10 })
    const { data: pagination, refresh } = useRequest(() => {
        const { host, alias, onlyDetected } = filterOption.value || {}
        const param: SiteQueryParam = { host, alias, source: onlyDetected ? "DETECTED" : undefined }
        return siteService.selectByPage(param, page.value)
    })
    watch([filterOption, page], refresh)

    return () => <ContentContainer v-slots={{
        filter: () => <SiteManageFilter
            defaultValue={filterOption.value}
            onChange={(option: SiteManageFilterOption) => filterOption.value = option}
            onCreate={() => modify.value?.add?.()}
        />,
        content: () => <>
            <SiteManageTable data={pagination.value?.list} onRowDelete={refresh} onRowModify={refresh} />
            <Pagination
                defaultValue={page.value}
                total={pagination.value?.total || 0}
                onChange={(num, size) => page.value = { num, size }}
            />
            <Modify ref={modify} onSave={refresh} />
        </>,
    }} />
})
