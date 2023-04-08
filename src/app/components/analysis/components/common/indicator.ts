/**
 * Copyright (c) 2023 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { I18nKey } from "@app/locale"
import type { PropType, VNode } from "vue"

import { tN } from "@app/locale"
import { defineComponent, h } from "vue"

export type IndicatorProps = {
    mainName: string
    mainValue: string
    subTips?: I18nKey
    subValue?: string
}

function renderChildren(props: IndicatorProps): VNode[] {
    const { mainName, subTips, mainValue, subValue } = props
    const children = [
        h('div', { class: 'indicator-name' }, mainName),
        h('div', { class: 'indicator-value' }, mainValue || '-'),
    ]
    const subTipsLine = []
    if (subTips || subValue) {
        const subValueSpan = h('span', { class: 'indicator-sub-value' }, subValue || '-')
        if (subTips) {
            subTipsLine.push(...tN(subTips, { value: subValueSpan }))
        } else {
            subTipsLine.push(subValueSpan)
        }
    } else {
        subTipsLine.push('')
    }
    children.push(h('div', { class: 'indicator-sub-tip' }, subTipsLine))
    return children
}

const _default = defineComponent({
    props: {
        mainName: String,
        mainValue: String,
        subTips: Function as PropType<I18nKey>,
        subValue: String,
    },
    setup(props) {
        return () => h('div', { class: 'analysis-indicator-container' }, renderChildren(props))
    }
})

export default _default