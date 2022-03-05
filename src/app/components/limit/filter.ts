/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Plus } from "@element-plus/icons"
import { Ref, h } from "vue"
import InputFilterItem from "@app/components/common/input-filter-item"
import SwitchFilterItem from "@app/components/common/switch-filter-item"
import ButtonFilterItem from "@app/components/common/button-filter-item"
import { renderFilterContainer } from "../common/filter"
import { t } from "@app/locale"

type _Props = {
    urlRef: Ref<string>
    onlyEnabledRef: Ref<boolean>
    handleAdd: () => void
    handleTest: () => void
}

export type FilterProps = _Props

const urlPlaceholder = t(msg => msg.limit.conditionFilter)
const onlyEnabledLabel = t(msg => msg.limit.filterDisabled)
const addButtonText = t(msg => msg.limit.button.add)
const filterItems = (props: _Props) => [
    h(InputFilterItem, {
        placeholder: urlPlaceholder,
        onClear: () => props.urlRef.value = "",
        onEnter: (newVal: string) => props.urlRef.value = newVal
    }),
    h(SwitchFilterItem, {
        label: onlyEnabledLabel,
        defaultValue: props.onlyEnabledRef.value,
        onChange: (newVal: boolean) => props.onlyEnabledRef.value = newVal
    }),
    h(ButtonFilterItem, {
        text: addButtonText,
        type: "success",
        icon: Plus,
        onClick: () => props.handleAdd()
    })
    // todo
    // buttonFilterItem({ type: 'primary', label: msg => msg.limit.button.test, onClick: props.handleTest, icon: 'search' })
]

export default renderFilterContainer(filterItems)