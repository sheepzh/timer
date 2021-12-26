/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { HostAliasSource } from "@entity/dao/host-alias"
import { QueryData } from "@app/components/common/constants"
import { buttonFilterItem, inputFilterItem, renderFilterContainer, switchFilterItem } from "../common/filter"
import { computed, Ref } from "vue"
import { Plus } from "@element-plus/icons"

export type FilterProps = {
    hostRef: Ref<string>,
    aliasRef: Ref<string>,
    sourceRef: Ref<HostAliasSource>
    queryData: QueryData
    handleAdd: () => Promise<void>
}

const childNodes = (props: FilterProps) => {
    const onlyDetected: Ref<boolean> = computed({
        get: () => props.sourceRef.value === HostAliasSource.DETECTED,
        set: newVal => props.sourceRef.value = newVal ? HostAliasSource.DETECTED : undefined
    })
    return [
        inputFilterItem(props.hostRef, msg => msg.siteManage.hostPlaceholder, props.queryData),
        inputFilterItem(props.aliasRef, msg => msg.siteManage.aliasPlaceholder, props.queryData),
        ...switchFilterItem(onlyDetected, msg => msg.siteManage.onlyDetected, props.queryData),
        buttonFilterItem({ type: 'success', label: msg => msg.siteManage.button.add, onClick: props.handleAdd, icon: Plus, right: true }),
    ]
}


export default renderFilterContainer(childNodes)