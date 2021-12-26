/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTable } from "element-plus"
import HostAlias from "@entity/dao/host-alias"
import { h, Ref } from "vue"
import columns, { ColumnProps } from "./column"

export type TableProps = ColumnProps & {
    dataRef: Ref<HostAlias[]>
}

const table = (props: TableProps) => {
    const elTableProps = {
        data: props.dataRef.value,
        border: true,
        size: 'mini',
        style: { width: '100%' },
        highlightCurrentRow: true,
        fit: true,
    }
    return h(ElTable, elTableProps, () => columns(props))
}

export default table