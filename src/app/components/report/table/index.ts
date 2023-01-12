/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { PropType } from "vue"

import { ElTable } from "element-plus"
import { defineComponent, h } from "vue"
import SelectionColumn from "./columns/selection"
import DateColumn from "./columns/date"
import HostColumn from "./columns/host"
import AliasColumn from "./columns/alias"
import FocusColumn from "./columns/focus"
import TimeColumn from "./columns/time"
import OperationColumn from "./columns/operation"

const _default = defineComponent({
    name: "ReportTable",
    props: {
        data: Array as PropType<timer.stat.Row[]>,
        defaultSort: Object as PropType<SortInfo>,
        mergeDate: Boolean,
        mergeHost: Boolean,
        timeFormat: String as PropType<timer.app.TimeFormat>,
        dateRange: Array as PropType<Date[]>,
        whitelist: Array as PropType<string[]>
    },
    emits: {
        sortChange: (_newSortInfo: SortInfo) => true,
        aliasChange: (_host: string, _newAlias: string) => true,
        itemDelete: (_row: timer.stat.Row) => true,
        whitelistChange: (_host: string, _addOrRemove: boolean) => true,
    },
    setup(props, ctx) {
        let selectedRows: timer.stat.Row[] = []
        ctx.expose({
            getSelected(): timer.stat.Row[] {
                return selectedRows || []
            }
        })
        return () => h(ElTable, {
            data: props.data,
            border: true,
            size: 'small',
            defaultSort: props.defaultSort,
            style: { width: '100%' },
            highlightCurrentRow: true,
            "onSelection-change": (data: timer.stat.Row[]) => selectedRows = data,
            fit: true,
            onSortChange: (newSortInfo: SortInfo) => ctx.emit("sortChange", newSortInfo)
        }, () => {
            const result = [
                h(SelectionColumn, { disabled: props.mergeHost })
            ]
            props.mergeDate || result.push(h(DateColumn))
            result.push(h(HostColumn, { mergeHost: props.mergeHost }))
            result.push(h(AliasColumn, {
                onAliasChange: (host: string, newAlias: string) => ctx.emit("aliasChange", host, newAlias)
            }))
            result.push(h(FocusColumn, { timeFormat: props.timeFormat }))
            result.push(h(TimeColumn))
            result.push(h(OperationColumn, {
                mergeDate: props.mergeDate,
                mergeHost: props.mergeHost,
                dateRange: props.dateRange,
                whitelist: props.whitelist,
                onDelete: (row: timer.stat.Row) => ctx.emit("itemDelete", row),
                onWhitelistChange: (host: string, addOrRemove: boolean) => ctx.emit("whitelistChange", host, addOrRemove)
            }))
            return result
        })
    }
})

export default _default
