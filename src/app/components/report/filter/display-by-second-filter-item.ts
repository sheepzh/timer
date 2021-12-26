/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Ref } from "vue"
import { QueryData } from "@app/components/common/constants"
import { switchFilterItem } from "@app/components/common/filter"

type _Props = {
    displayBySecondRef: Ref<boolean>
    queryData: QueryData
}

export type DisplayBySecondFilterItemProps = _Props

export default ({
    displayBySecondRef,
    queryData
}: DisplayBySecondFilterItemProps) => switchFilterItem(displayBySecondRef, msg => msg.report.displayBySecond, queryData)