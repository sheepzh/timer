/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { HostAliasSource } from "@entity/dao/host-alias"
import { QueryData } from "@app/components/common/constants"
import InputFilterItem from "@app/components/common/input-filter-item"
import SwitchFilterItem from "@app/components/common/switch-filter-item"
import ButtonFilterItem from "@app/components/common/button-filter-item"
import { renderFilterContainer } from "../common/filter"
import { computed, Ref, h, watch } from "vue"
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
const onlyDetectedLabel = t(msg => msg.siteManage.onlyDetected)
const addButtonText = t(msg => msg.siteManage.button.add)
const childNodes = (props: FilterProps) => {
    const onlyDetected: Ref<boolean> = computed({
        get: () => props.sourceRef.value === HostAliasSource.DETECTED,
        set: newVal => props.sourceRef.value = newVal ? HostAliasSource.DETECTED : undefined
    })
    watch(onlyDetected, () => props.queryData())
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
        h(SwitchFilterItem, {
            label: onlyDetectedLabel,
            defaultValue: false,
            onChange: (newVal: boolean) => onlyDetected.value = newVal
        }),
        h(ButtonFilterItem, {
            text: addButtonText,
            icon: Plus,
            type: "success",
            onClick: () => props.handleAdd?.()
        })
    ]
}

export default renderFilterContainer(childNodes)