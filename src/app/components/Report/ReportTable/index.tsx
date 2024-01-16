/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { PropType } from "vue"

import { ElTable } from "element-plus"
import { defineComponent, ref, watch } from "vue"
import SelectionColumn from "./columns/selection"
import DateColumn from "./columns/DateColumn"
import HostColumn from "./columns/HostColumn"
import AliasColumn from "./columns/AliasColumn"
import FocusColumn from "./columns/FocusColumn"
import TimeColumn from "./columns/time"
import OperationColumn from "./columns/operation"

export type TableInstance = {
    getSelected(): timer.stat.Row[]
}

const _default = defineComponent({
    props: {
        data: Array as PropType<timer.stat.Row[]>,
        defaultSort: Object as PropType<SortInfo>,
        mergeDate: Boolean,
        mergeHost: Boolean,
        timeFormat: String as PropType<timer.app.TimeFormat>,
        dateRange: Object as PropType<[Date, Date]>,
        whitelist: Array as PropType<string[]>,
        readRemote: Boolean,
    },
    emits: {
        sortChange: (_newSortInfo: SortInfo) => true,
        aliasChange: (_host: string, _newAlias: string) => true,
        itemDelete: (_row: timer.stat.Row) => true,
        whitelistChange: (_host: string, _addOrRemove: boolean) => true,
    },
    setup(props, ctx) {
        let selectedRows: timer.stat.Row[] = []
        const readRemote = ref(props.readRemote)
        watch(() => props.readRemote, newVal => readRemote.value = newVal)
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
                <SelectionColumn disabled={props.mergeHost} />
                {!props.mergeDate && <DateColumn />}
                <HostColumn {...props} />
                <AliasColumn onAliasChange={(host, newAlias) => ctx.emit("aliasChange", host, newAlias)} />
                <FocusColumn {...props} />
                <TimeColumn {...props} />
                <OperationColumn
                    {...props}
                    onDelete={row => ctx.emit("itemDelete", row)}
                    onWhitelistChange={(host, addOrRemove) => ctx.emit("whitelistChange", host, addOrRemove)}
                />
            </ElTable>
        )
    }
})

export default _default
