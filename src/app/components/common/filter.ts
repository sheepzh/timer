/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElButton, ElCard } from "element-plus"
import ElementIcon from "@app/element-ui/icon"
import { h, VNode } from "vue"
import { I18nKey, t } from "@app/locale"

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

type FilterButtonProps = {
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