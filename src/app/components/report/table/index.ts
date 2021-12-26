/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTable } from "element-plus"
import { h, Ref, UnwrapRef } from "vue"
import DataItem from "@entity/dto/data-item"
import columns, { ColumnProps } from "./columns"

export enum ElSortDirect {
    ASC = 'ascending',
    DESC = 'descending'
}

export type SortInfo = {
    prop: Timer.DataDimension | 'host'
    order: ElSortDirect
}

export type TableProps = ColumnProps &
{
    dataRef: Ref<DataItem[]>
    sortRef: UnwrapRef<SortInfo>
}

const table = (props: TableProps) => {
    const handleSortChange = (newSort: SortInfo) => {
        props.sortRef.order = newSort.order
        props.sortRef.prop = newSort.prop
        props.queryData()
    }
    const elTableProps = {
        data: props.dataRef.value,
        border: true,
        size: 'mini',
        defaultSort: props.sortRef,
        style: { width: '100%' },
        highlightCurrentRow: true,
        fit: true,
        onSortChange: handleSortChange
    }
    return h(ElTable, elTableProps, () => columns(props))
}

export default table