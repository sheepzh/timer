/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, ref } from "vue"
import ContentContainer from "../common/ContentContainer"
import SiteManageFilter, { FilterOption } from "./SiteManageFilter"
import Pagination from "../common/Pagination"
import SiteManageTable from "./SiteManageTable"
import siteService, { SiteQueryParam } from "@service/site-service"
import Modify, { ModifyInstance } from './SiteManageModify'
import { useRequest, useState } from "@hooks"

export default defineComponent(() => {
    const [filterOption, setFilterOption] = useState<FilterOption>()
    const modify = ref<ModifyInstance>()
    const [page, setPage] = useState<timer.common.PageQuery>({ num: 1, size: 10 })
    const { data: pagination, refresh } = useRequest(() => {
        const { host, alias, onlyDetected } = filterOption.value || {}
        const param: SiteQueryParam = { host, alias, source: onlyDetected ? "DETECTED" : undefined }
        return siteService.selectByPage(param, page.value)
    }, { deps: [filterOption, page] })

    return () => <ContentContainer v-slots={{
        filter: () => <SiteManageFilter
            defaultValue={filterOption.value}
            onChange={setFilterOption}
            onCreate={() => modify.value?.add?.()}
        />,
        content: () => <>
            <SiteManageTable data={pagination.value?.list} onRowDelete={refresh} onRowModify={refresh} />
            <Pagination
                defaultValue={page.value}
                total={pagination.value?.total || 0}
                onChange={setPage}
            />
            <Modify ref={modify} onSave={refresh} />
        </>,
    }} />
})
