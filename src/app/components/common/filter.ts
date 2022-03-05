/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCard } from "element-plus"
import { h, VNode } from "vue"

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