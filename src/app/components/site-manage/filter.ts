/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { HostAliasSource } from "../../../entity/dao/host-alias"
import { QueryData } from "../common/constants"
import { buttonFilterItem, inputFilterItem, renderFilterContainer } from "../common/filter"
import { Ref } from "vue"
import { Plus } from "@element-plus/icons"

export type FilterProps = {
    hostRef: Ref<string>,
    aliasRef: Ref<string>,
    sourceRef: Ref<HostAliasSource>
    queryData: QueryData
    handleAdd: () => Promise<void>
}

const childNodes = (props: FilterProps) =>
    [
        inputFilterItem(props.hostRef, msg => msg.siteManage.hostPlaceholder, props.queryData),
        inputFilterItem(props.aliasRef, msg => msg.siteManage.aliasPlaceholder, props.queryData),
        buttonFilterItem({ type: 'success', label: msg => msg.siteManage.button.add, onClick: props.handleAdd, icon: Plus }),
    ]

export default renderFilterContainer(childNodes)