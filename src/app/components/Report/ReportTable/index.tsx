/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { ElTable, ElTableColumn } from "element-plus"
import { defineComponent, type PropType } from "vue"
import DateColumn from "./columns/DateColumn"
import HostColumn from "./columns/HostColumn"
import FocusColumn from "./columns/FocusColumn"
import TimeColumn from "./columns/TimeColumn"
import OperationColumn from "./columns/OperationColumn"
import { useReportFilter } from "../context"
import { useState } from "@hooks"
import { t } from "@app/locale"
import Editable from "@app/components/common/Editable"

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
        const [selection, setSelection] = useState<timer.stat.Row[]>([])
        ctx.expose({ getSelected: () => selection.value } satisfies TableInstance)
        return () => (
            <ElTable
                data={props.data}
                border
                size="small"
                defaultSort={props.defaultSort}
                style={{ width: "100%" }}
                fit
                highlightCurrentRow
                onSelection-change={setSelection}
                onSort-change={(newSortInfo: SortInfo) => ctx.emit("sortChange", newSortInfo)}
            >
                <ElTableColumn type="selection" selectable={() => !filterOption.value?.mergeHost} />
                {!filterOption.value?.mergeDate && <DateColumn />}
                <HostColumn />
                <ElTableColumn
                    label={t(msg => msg.siteManage.column.alias)}
                    minWidth={140}
                    align="center"
                    v-slots={({ row }: { row: timer.stat.Row }) => <Editable
                        modelValue={row.alias}
                        onChange={newAlias => ctx.emit("aliasChange", row.host, newAlias)}
                    />}
                />
                <FocusColumn />
                <TimeColumn />
                <OperationColumn onDelete={row => ctx.emit("itemDelete", row)} />
            </ElTable>
        )
    }
})

export default _default
