/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { ElTable, ElTableColumn } from "element-plus"
import { computed, defineComponent, type PropType } from "vue"
import DateColumn from "./columns/DateColumn"
import HostColumn from "./columns/HostColumn"
import FocusColumn from "./columns/FocusColumn"
import TimeColumn from "./columns/TimeColumn"
import OperationColumn from "./columns/OperationColumn"
import { DisplayComponent, ReportFilterOption, useReportFilter } from "../context"
import { useRequest, useState, useWindowVisible } from "@hooks"
import { t } from "@app/locale"
import Editable from "@app/components/common/Editable"
import ContentCard from "@app/components/common/ContentCard"
import Pagination from "@app/components/common/Pagination"
import statService, { StatQueryParam } from "@service/stat-service"
import siteService from "@service/site-service"
import { cvtOption2Param } from "../common"

function computeTimerQueryParam(filterOption: ReportFilterOption, sort: SortInfo): StatQueryParam {
    const param = cvtOption2Param(filterOption) || {}
    param.sort = sort.prop
    param.sortOrder = sort.order === 'ascending' ? 'ASC' : 'DESC'
    return param
}

async function handleAliasChange(key: timer.site.SiteKey, newAlias: string, data: timer.stat.Row[]) {
    newAlias = newAlias?.trim?.()
    if (!newAlias) {
        await siteService.removeAlias(key)
    } else {
        await siteService.saveAlias(key, newAlias, 'USER')
    }
    data?.filter(item => item.host === key.host)
        ?.forEach(item => item.alias = newAlias)
}

const _default = defineComponent({
    props: {
        defaultSort: Object as PropType<SortInfo>,
    },
    setup(props, ctx) {
        const [page, setPage] = useState<timer.common.PageQuery>({ size: 10, num: 1 })
        const [sort, setSort] = useState(props.defaultSort)
        const filterOption = useReportFilter()
        const queryParam = computed(() => computeTimerQueryParam(filterOption.value, sort.value))
        const { data, refresh } = useRequest(
            () => statService.selectByPage(queryParam.value, page.value, true),
            { loadingTarget: "#report-table-content", deps: [queryParam, page], manual: true }
        )
        // Query data if window become visible
        useWindowVisible({ onVisible: refresh })

        const [selection, setSelection] = useState<timer.stat.Row[]>([])
        ctx.expose({
            getSelected: () => selection.value,
            refresh,
        } satisfies DisplayComponent)

        return () => (
            <ContentCard id="report-table-content">
                <ElTable
                    data={data.value?.list}
                    border
                    size="small"
                    defaultSort={props.defaultSort}
                    style={{ width: "100%" }}
                    fit
                    highlightCurrentRow
                    onSelection-change={setSelection}
                    onSort-change={(newSortInfo: SortInfo) => setSort(newSortInfo)}
                >
                    <ElTableColumn type="selection" selectable={() => !filterOption.value?.mergeHost} />
                    {!filterOption.value?.mergeDate && <DateColumn />}
                    <HostColumn />
                    <ElTableColumn
                        label={t(msg => msg.siteManage.column.alias)}
                        minWidth={140}
                        align="center"
                        v-slots={({ row }: { row: timer.stat.Row }) => (
                            <Editable
                                modelValue={row.alias}
                                onChange={newAlias => handleAliasChange({ host: row.host, merged: filterOption.value?.mergeHost }, newAlias, data.value?.list)}
                            />
                        )}
                    />
                    <FocusColumn />
                    <TimeColumn />
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
