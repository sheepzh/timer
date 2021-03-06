import { ElTable } from "element-plus"
import { h, Ref, UnwrapRef } from "vue"
import SiteInfo, { SiteItem } from "../../../entity/dto/site-info"
import columns, { ColumnProps } from "./table-column"

export enum ElSortDirect {
    ASC = 'ascending',
    DESC = 'descending'
}

export type SortInfo = {
    prop: SiteItem | 'host'
    order: ElSortDirect
}

export type TableProps = ColumnProps &
{
    dataRef: Ref<SiteInfo[]>
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