/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { h, Ref } from "vue"
import AliasColumn from "./alias"
import DateColumn from "./date"
import HostColumn from "./host"
import FocusColumn from './focus'
import TotalColumn from './total'
import TimeColumn from "./time"
import operationButtons, { OperationButtonColumnProps } from "./operation"

export type ColumnProps = OperationButtonColumnProps & {
    displayBySecondRef: Ref<boolean>
}

const columns = (props: ColumnProps) => {
    const result = []
    props.mergeDateRef.value || result.push(h(DateColumn))
    result.push(h(HostColumn, { mergeHost: props.mergeHostRef.value }))
    props.mergeHostRef.value || result.push(h(AliasColumn))
    result.push(h(FocusColumn, { displayBySecond: props.displayBySecondRef.value }))
    result.push(h(TotalColumn, { displayBySecond: props.displayBySecondRef.value }))
    result.push(h(TimeColumn))
    result.push(operationButtons(props))
    return result
}

export default columns
