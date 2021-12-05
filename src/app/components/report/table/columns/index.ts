/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import dateCol from "./date"
import hostCol, { HostColumnProps } from "./host"
import itemColumns, { ItemColumnProps } from "./item-columns"
import operationButtons, { OperationButtonColumnProps } from "./operation"

export type ColumnProps = HostColumnProps & ItemColumnProps & OperationButtonColumnProps

const columns = (props: ColumnProps) => {
    const result = []
    props.mergeDateRef.value || result.push(dateCol())
    result.push(hostCol(props))
    result.push(...itemColumns(props))
    result.push(operationButtons(props))
    return result
}

export default columns
