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
import OperationColumn from "./operation"
import { QueryData } from "@app/components/common/constants"

export type ColumnProps = {
    queryWhiteList: () => Promise<void>
    queryData: QueryData
    handleAliasChange: (host: string, newAlias: string) => void
    whitelistRef: Ref<string[]>
    mergeDateRef: Ref<boolean>
    mergeHostRef: Ref<boolean>
    dateRangeRef: Ref<Array<Date>>
    displayBySecondRef: Ref<boolean>
}

const columns = (props: ColumnProps) => {
    const result = []
    props.mergeDateRef.value || result.push(h(DateColumn))
    result.push(h(HostColumn, { mergeHost: props.mergeHostRef.value }))
    props.mergeHostRef.value || result.push(h(AliasColumn, { onAliasChange: props.handleAliasChange }))
    result.push(h(FocusColumn, { displayBySecond: props.displayBySecondRef.value }))
    result.push(h(TotalColumn, { displayBySecond: props.displayBySecondRef.value }))
    result.push(h(TimeColumn))
    result.push(h(OperationColumn, {
        mergeDate: props.mergeDateRef.value,
        mergeHost: props.mergeHostRef.value,
        dateRange: props.dateRangeRef.value,
        whitelist: props.whitelistRef.value,
        onDelete: () => props.queryData(),
        onChangeWhitelist: () => props.queryWhiteList()
    }))
    return result
}

export default columns
