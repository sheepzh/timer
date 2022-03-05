/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Plus } from "@element-plus/icons"
import { Ref, h } from "vue"
import InputFilterItem from "@app/components/common/input-filter-item"
import { buttonFilterItem, renderFilterContainer, switchFilterItem } from "../common/filter"
import { t } from "@app/locale"

type _Props = {
    urlRef: Ref<string>
    onlyEnabledRef: Ref<boolean>
    handleAdd: () => void
    handleTest: () => void
}

export type FilterProps = _Props

const urlPlaceholder = t(msg => msg.limit.conditionFilter)
const filterItems = (props: _Props) => [
    h(InputFilterItem, {
        placeholder: urlPlaceholder,
        onClear: () => props.urlRef.value = "",
        onEnter: (newVal: string) => props.urlRef.value = newVal
    }),
    ...switchFilterItem(props.onlyEnabledRef, msg => msg.limit.filterDisabled),
    buttonFilterItem({ type: 'success', label: msg => msg.limit.button.add, onClick: props.handleAdd, icon: Plus, right: true }),
    // todo
    // buttonFilterItem({ type: 'primary', label: msg => msg.limit.button.test, onClick: props.handleTest, icon: 'search' })
]

export default renderFilterContainer(filterItems)