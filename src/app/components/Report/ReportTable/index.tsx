/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { PropType } from "vue"

import { ElTable, ElTableColumn } from "element-plus"
import { defineComponent } from "vue"
import DateColumn from "./columns/DateColumn"
import HostColumn from "./columns/HostColumn"
import AliasColumn from "./columns/AliasColumn"
import FocusColumn from "./columns/FocusColumn"
import TimeColumn from "./columns/TimeColumn"
import OperationColumn from "./columns/OperationColumn"
import { useReportFilter } from "../context"

export type TableInstance = {
    getSelected(): timer.stat.Row[]
}

const _default = defineComponent({
    props: {
        data: Array as PropType<timer.stat.Row[]>,
        defaultSort: Object as PropType<SortInfo>,
    },
    emits: {
        sortChange: (_newSortInfo: SortInfo) => true,
        aliasChange: (_host: string, _newAlias: string) => true,
        itemDelete: (_row: timer.stat.Row) => true,
    },
    setup(props, ctx) {
        const filterOption = useReportFilter()
        let selectedRows: timer.stat.Row[] = []
        const instance: TableInstance = { getSelected: () => selectedRows }
        ctx.expose(instance)
        return () => (
            <ElTable
                data={props.data}
                border
                size="small"
                defaultSort={props.defaultSort}
                style={{ width: "100%" }}
                fit
                highlightCurrentRow
                onSelection-change={(data: timer.stat.Row[]) => selectedRows = data}
                onSort-change={(newSortInfo: SortInfo) => ctx.emit("sortChange", newSortInfo)}
            >
                <ElTableColumn type="selection" selectable={() => !filterOption.value?.mergeHost} />
                {!filterOption.value?.mergeDate && <DateColumn />}
                <HostColumn />
                <AliasColumn onAliasChange={(host, newAlias) => ctx.emit("aliasChange", host, newAlias)} />
                <FocusColumn />
                <TimeColumn />
                <OperationColumn onDelete={row => ctx.emit("itemDelete", row)} />
            </ElTable>
        )
    }
})

export default _default
