/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { PropType } from "vue"

import { ElTable } from "element-plus"
import { defineComponent, h } from "vue"
import DataItem from "@entity/dto/data-item"
import SelectionColumn from "./columns/selection"
import DateColumn from "./columns/date"
import HostColumn from "./columns/host"
import AliasColumn from "./columns/alias"
import FocusColumn from "./columns/focus"
import TotalColumn from "./columns/total"
import TimeColumn from "./columns/time"
import OperationColumn from "./columns/operation"

export enum ElSortDirect {
    ASC = 'ascending',
    DESC = 'descending'
}

export type SortInfo = {
    prop: Timer.DataDimension | 'host'
    order: ElSortDirect
}

const _default = defineComponent({
    name: "ReportTable",
    props: {
        data: Array as PropType<DataItem[]>,
        defaultSort: Object as PropType<SortInfo>,
        mergeDate: Boolean,
        mergeHost: Boolean,
        displayBySecond: Boolean,
        dateRange: Array as PropType<Date[]>,
        whitelist: Array as PropType<string[]>
    },
    emits: ["sortChange", "aliasChange", "itemDelete", "whitelistChange"],
    setup(props, ctx) {
        let selectedRows: DataItem[] = []
        ctx.expose({
            getSelected(): DataItem[] {
                return selectedRows || []
            }
        })
        return () => h(ElTable, {
            data: props.data,
            border: true,
            size: 'mini',
            defaultSort: props.defaultSort,
            style: { width: '100%' },
            highlightCurrentRow: true,
            "onSelection-change": (data: DataItem[]) => selectedRows = data,
            fit: true,
            onSortChange: (newSortInfo: SortInfo) => ctx.emit("sortChange", newSortInfo)
        }, () => {
            const result = [
                h(SelectionColumn, { disabled: props.mergeHost })
            ]
            props.mergeDate || result.push(h(DateColumn))
            result.push(h(HostColumn, { mergeHost: props.mergeHost }))
            props.mergeHost || result.push(h(AliasColumn, {
                onAliasChange: (host: string, newAlias: string) => ctx.emit("aliasChange", host, newAlias)
            }))
            result.push(h(FocusColumn, { displayBySecond: props.displayBySecond }))
            result.push(h(TotalColumn, { displayBySecond: props.displayBySecond }))
            result.push(h(TimeColumn))
            result.push(h(OperationColumn, {
                mergeDate: props.mergeDate,
                mergeHost: props.mergeHost,
                dateRange: props.dateRange,
                whitelist: props.whitelist,
                onDelete: (row: DataItem) => ctx.emit("itemDelete", row),
                onWhitelistChange: (host: string, addOrRemove: boolean) => ctx.emit("whitelistChange", host, addOrRemove)
            }))
            return result
        })
    }
})

export default _default
