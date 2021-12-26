/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElButton, ElCard, ElInput, ElSwitch } from "element-plus"
import ElementIcon from "@app/element-ui/icon"
import { h, Ref, VNode } from "vue"
import { I18nKey, t } from "@app/locale"
import { QueryData } from "./constants"

/**
 * @returns the render function of filter containers
 */
export function renderFilterContainer<Props>(childNodes: (props: Props) => VNode[]): (props: Props) => VNode {
    //  The container render function
    return (props: Props) => h(ElCard,
        { bodyStyle: { paddingBottom: '10px', paddingTop: '18px' } },
        () => childNodes(props)
    )
}

type _I18nKey = I18nKey | string

const processI18nKey = (key: _I18nKey) => typeof key !== 'string' ? t(key) : key

/** 
 * @returns filter item input VNode 
 */
export const inputFilterItem = (modelValue: Ref<string>, placeholder: _I18nKey, queryData?: QueryData) => h(ElInput,
    {
        class: 'filter-item',
        modelValue: modelValue.value,
        placeholder: processI18nKey(placeholder),
        clearable: true,
        onClear: () => modelValue.value = '',
        onInput: (val: string) => modelValue.value = val.trim(),
        onKeyup: (event: KeyboardEvent) => event.key === 'Enter' && queryData?.()
    }
)

const switchLabel = (label: string) => h('a', { class: 'filter-name' }, label)

const elSwitch = (modelValue: Ref<boolean>, queryData?: QueryData) => h(ElSwitch,
    {
        class: 'filter-item',
        modelValue: modelValue.value,
        onChange: (val: boolean) => {
            modelValue.value = val
            queryData?.()
        }
    }
)

export const switchFilterItem = (modelValue: Ref<boolean>, labelName: _I18nKey, queryData?: QueryData) => [
    switchLabel(processI18nKey(labelName)),
    elSwitch(modelValue, queryData)
]

export type FilterButtonProps = {
    onClick: () => void
    type?: 'primary' | 'info' | 'success' | 'warning' | 'danger'
    label: _I18nKey
    icon?: ElementIcon
    right?: boolean
}

export const buttonFilterItem = ({ onClick, type, label, icon, right }: FilterButtonProps) => h<{}>(ElButton, {
    class: 'filter-item' + (right ? ' filter-item-right' : ''),
    type,
    icon: icon,
    onClick
}, () => processI18nKey(label))