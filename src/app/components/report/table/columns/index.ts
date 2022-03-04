/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { h } from "vue"
import aliasCol from "./alias"
import dateCol from "./date"
import HostColumn from "./host"
import itemColumns, { ItemColumnProps } from "./item-columns"
import operationButtons, { OperationButtonColumnProps } from "./operation"

export type ColumnProps = ItemColumnProps & OperationButtonColumnProps

const columns = (props: ColumnProps) => {
    const result = []
    props.mergeDateRef.value || result.push(dateCol())
    result.push(h(HostColumn, { mergeHost: props.mergeHostRef.value }))
    props.mergeHostRef.value || result.push(aliasCol())
    result.push(...itemColumns(props))
    result.push(operationButtons(props))
    return result
}

export default columns
