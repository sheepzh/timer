/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Ref } from "vue"
import { QueryData } from "../../common/constants"
import { switchFilterItem } from "../../common/filter"

export type MergeDateFilterItemProps = {
    mergeDateRef: Ref<boolean>
    queryData: QueryData
}

export default ({
    mergeDateRef,
    queryData
}: MergeDateFilterItemProps) => switchFilterItem(mergeDateRef, msg => msg.report.mergeDate, queryData)