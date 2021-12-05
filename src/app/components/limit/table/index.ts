/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTable } from "element-plus"
import { h, Ref } from "vue"
import TimeLimitItem from "../../../../entity/dto/time-limit-item"
import { QueryData } from "../../common/constants"
import columns from "./column"

type _Props = {
    list: Ref<TimeLimitItem[]>
    queryData: QueryData
}

export type TableProps = _Props

const elTableProps = {
    border: true,
    size: 'mini',
    style: { width: '100%' },
    highlightCurrentRow: true,
    fit: true
}

const _default = ({ list, queryData }: _Props) => h(ElTable, { ...elTableProps, data: list.value }, () => columns(queryData))

export default _default