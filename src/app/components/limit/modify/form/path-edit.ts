/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElSwitch, ElTag, ElTooltip } from "element-plus"
import { h, Ref, VNode } from "vue"
import { t } from "@app/locale"
import UrlPathItem from "./url-path-item"

type _Props = {
    pathItemsRef: Ref<UrlPathItem[]>
}

const switchStyle = { marginRight: '2px' }
const tagContent = (item: UrlPathItem, index: number, arr: UrlPathItem[]) => {
    const result: VNode[] = []
    if (!!index) {
        const modelValue = item.ignored
        const onChange = (val: boolean) => item.ignored = val
        const switchNode = h(ElSwitch, { style: switchStyle, modelValue, onChange })

        const tooltipNode = h(ElTooltip, { content: t(msg => msg.limit.useWildcard) }, { default: () => switchNode })
        result.push(tooltipNode)
    }
    result.push(h('span', {}, item.origin))
    return result
}

const tabStyle = { marginBottom: '5px' }
const item2Tag = (item: UrlPathItem, index: number, arr: UrlPathItem[]) => {
    const isNotHost: boolean = !!index
    return h(ElTag,
        {
            type: isNotHost ? '' : 'info',
            closable: isNotHost,
            onClose: () => arr.splice(index),
            style: tabStyle
        },
        {
            default: () => tagContent(item, index, arr)
        }
    )
}
const combineStyle = {
    fontSize: '14px',
    margin: '0 2px',
    ...tabStyle
}
const combineTags = (arr: VNode[], current: VNode) => {
    arr.length && arr.push(h('span', { style: combineStyle }, '/'))
    arr.push(current)
    return arr
}

const _default = (props: _Props) => h('div', {}, props.pathItemsRef.value.map(item2Tag).reduce(combineTags, []))

export default _default