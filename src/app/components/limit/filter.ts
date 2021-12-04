/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Ref } from "vue"
import { buttonFilterItem, inputFilterItem, renderFilterContainer, switchFilterItem } from "../common/filter"

type _Props = {
    urlRef: Ref<string>
    onlyEnabledRef: Ref<boolean>
    handleAdd: () => void
    handleTest: () => void
}

export type FilterProps = _Props

const filterItems = (props: _Props) => [
    inputFilterItem(props.urlRef, msg => msg.limit.conditionFilter),
    ...switchFilterItem(props.onlyEnabledRef, msg => msg.limit.filterDisabled),
    buttonFilterItem({ type: 'success', label: msg => msg.limit.button.add, onClick: props.handleAdd, icon: 'plus' }),
    // todo
    // buttonFilterItem({ type: 'primary', label: msg => msg.limit.button.test, onClick: props.handleTest, icon: 'search' })
]

export default renderFilterContainer(filterItems)