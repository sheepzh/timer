/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { HostAliasSource } from "@entity/dao/host-alias"
import { QueryData } from "@app/components/common/constants"
import InputFilterItem from "@app/components/common/input-filter-item"
import { buttonFilterItem, renderFilterContainer, switchFilterItem } from "../common/filter"
import { computed, Ref, h } from "vue"
import { Plus } from "@element-plus/icons"
import { t } from "@app/locale"

export type FilterProps = {
    hostRef: Ref<string>,
    aliasRef: Ref<string>,
    sourceRef: Ref<HostAliasSource>
    queryData: QueryData
    handleAdd: () => Promise<void>
}

const hostPlaceholder = t(msg => msg.siteManage.hostPlaceholder)
const aliasPlaceholder = t(msg => msg.siteManage.aliasPlaceholder)
const childNodes = (props: FilterProps) => {
    const onlyDetected: Ref<boolean> = computed({
        get: () => props.sourceRef.value === HostAliasSource.DETECTED,
        set: newVal => props.sourceRef.value = newVal ? HostAliasSource.DETECTED : undefined
    })
    return [
        h(InputFilterItem, {
            placeholder: hostPlaceholder,
            onClear() {
                props.hostRef.value = ""
                props.queryData()
            },
            onEnter(newVal: string) {
                props.hostRef.value = newVal
                props.queryData()
            }
        }),
        h(InputFilterItem, {
            placeholder: aliasPlaceholder,
            onClear() {
                props.aliasRef.value = ""
                props.queryData()
            },
            onEnter(newVal: string) {
                props.aliasRef.value = newVal
                props.queryData()
            }
        }),
        ...switchFilterItem(onlyDetected, msg => msg.siteManage.onlyDetected, props.queryData),
        buttonFilterItem({ type: 'success', label: msg => msg.siteManage.button.add, onClick: props.handleAdd, icon: Plus, right: true }),
    ]
}


export default renderFilterContainer(childNodes)