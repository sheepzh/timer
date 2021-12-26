/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 * */

import { Ref } from "vue"
import { QueryData } from "@app/components/common/constants"
import { switchFilterItem } from "@app/components/common/filter"

export type MergeHostFilterItemProps = {
    mergeHostRef: Ref<boolean>
    queryData: QueryData
}

export default ({ mergeHostRef, queryData }: MergeHostFilterItemProps) => switchFilterItem(
    mergeHostRef, msg => msg.report.mergeDomain, queryData
)