/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import ContentCard from "@app/components/common/ContentCard"
import Editable from "@app/components/common/Editable"
import Pagination from "@app/components/common/Pagination"
import { t } from "@app/locale"
import { useRequest, useState } from "@hooks"
import siteService from "@service/site-service"
import statService, { type StatQueryParam } from "@service/stat-service"
import { siteEqual } from "@util/site"
import { useDocumentVisibility } from "@vueuse/core"
import { ElTable, ElTableColumn, type TableInstance } from "element-plus"
import { computed, defineComponent, type PropType, ref, watch } from "vue"
import { cvtOption2Param } from "../common"
import { useReportFilter } from "../context"
import type { DisplayComponent, ReportFilterOption, ReportSort } from "../types"
import CateColumn from "./columns/CateColumn"
import DateColumn from "./columns/DateColumn"
import HostColumn from "./columns/HostColumn"
import OperationColumn from "./columns/OperationColumn"
import TimeColumn from "./columns/TimeColumn"
import VisitColumn from "./columns/VisitColumn"

function computeTimerQueryParam(filterOption: ReportFilterOption, sort: ReportSort): StatQueryParam {
    const param = cvtOption2Param(filterOption) || {}
    param.sort = sort.prop
    param.sortOrder = sort.order === 'ascending' ? 'ASC' : 'DESC'
    return param
}

async function handleAliasChange(key: timer.site.SiteKey, newAlias: string | undefined, data: timer.stat.Row[]) {
    newAlias = newAlias?.trim?.()
    if (!newAlias) {
        await siteService.removeAlias(key)
    } else {
        await siteService.saveAlias(key, newAlias)
    }
    data?.filter(item => siteEqual(item?.siteKey, key))
        ?.forEach(item => item.alias = newAlias)
}

const _default = defineComponent({
    props: {
        defaultSort: {
            type: Object as PropType<ReportSort>,
            required: true,
        },
    },
    setup(props, ctx) {
        const [page, setPage] = useState<timer.common.PageQuery>({ size: 10, num: 1 })
        const [sort, setSort] = useState(props.defaultSort)
        const filterOption = useReportFilter()
        const queryParam = computed(() => computeTimerQueryParam(filterOption.value, sort.value))
        const { data, refresh } = useRequest(
            () => statService.selectByPage(queryParam.value, page.value),
            { loadingTarget: "#report-table-content", deps: [queryParam, page] },
        )
        const runColVisible = computed(() => !!data.value?.list?.find(r => r.run))
        // Query data if document become visible
        const docVisible = useDocumentVisibility()
        watch(docVisible, () => docVisible.value && refresh())

        const [selection, setSelection] = useState<timer.stat.Row[]>([])
        ctx.expose({
            getSelected: () => selection.value,
            refresh,
        } satisfies DisplayComponent)

        const tableRef = ref<TableInstance>()
        // Force to re-layout after merge change
        watch([
            () => filterOption.value?.mergeDate,
            () => filterOption.value?.siteMerge,
        ], () => tableRef.value?.doLayout?.())

        const handleCateChange = (key: timer.site.SiteKey, newCateId: number | undefined) => {
            data.value?.list
                ?.filter(({ siteKey }) => siteEqual(siteKey, key))
                ?.forEach(i => i.cateId = newCateId)
        }

        return () => (
            <ContentCard id="report-table-content">
                <ElTable
                    ref={tableRef}
                    data={data.value?.list}
                    border
                    defaultSort={props.defaultSort}
                    style={{ width: "100%" }}
                    fit
                    highlightCurrentRow
                    onSelection-change={setSelection}
                    onSort-change={(newSortInfo: ReportSort) => setSort(newSortInfo)}
                >
                    {!filterOption.value?.siteMerge && <ElTableColumn type="selection" align="center" fixed="left" />}
                    {!filterOption.value?.mergeDate && <DateColumn />}
                    {filterOption.value?.siteMerge !== 'cate' && <>
                        <HostColumn />
                        <ElTableColumn
                            label={t(msg => msg.siteManage.column.alias)}
                            minWidth={140}
                            align="center"
                            v-slots={({ row }: { row: timer.stat.Row }) => (
                                <Editable
                                    modelValue={row?.alias}
                                    onChange={newAlias => row.siteKey && handleAliasChange(row.siteKey, newAlias, data.value?.list ?? [])}
                                />
                            )}
                        />
                    </>}
                    {filterOption.value?.siteMerge !== 'domain' && <CateColumn onChange={handleCateChange} />}
                    <TimeColumn dimension="focus" />
                    {runColVisible.value && <TimeColumn dimension="run" />}
                    <VisitColumn />
                    <OperationColumn onDelete={refresh} />
                </ElTable>
                <Pagination
                    defaultValue={page.value}
                    total={data.value?.total || 0}
                    onChange={setPage}
                />
            </ContentCard>
        )
    }
})

export default _default
