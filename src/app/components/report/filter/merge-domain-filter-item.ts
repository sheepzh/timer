/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 * */

import { Ref } from "vue"
import { QueryData } from "../../common/constants"
import { switchFilterItem } from "../../common/filter"

export type MergeDomainFilterItemProps = {
    mergeDomainRef: Ref<boolean>
    queryData: QueryData
}

export default ({ mergeDomainRef, queryData }: MergeDomainFilterItemProps) => switchFilterItem(
    mergeDomainRef, msg => msg.report.mergeDomain, queryData
)