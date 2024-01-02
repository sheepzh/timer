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
import "./indicator-cell.sass"
import { ElIcon, ElTooltip } from "element-plus"
import { InfoFilled } from "@element-plus/icons-vue"

export type IndicatorProps = {
    mainName: string
    mainValue: string
    subTips?: I18nKey
    subValue?: string
    subInfo?: string
}

function renderChildren(props: IndicatorProps): VNode[] {
    const { mainName, subTips, mainValue, subValue, subInfo } = props
    const children = [
        h('div', { class: 'kanban-indicator-cell-name' }, mainName),
        h('div', { class: 'kanban-indicator-cell-val' }, mainValue || '-'),
    ]
    const subTipsLine = []
    if (subTips || subValue) {
        const subValueSpan = h('span', { class: 'kanban-indicator-cell-sub-val' }, subValue || '-')
        if (subTips) {
            subTipsLine.push(...tN(subTips, { value: subValueSpan }))
        } else {
            subTipsLine.push(subValueSpan)
        }
        if (subInfo) {
            const tooltip = h(ElTooltip, { content: subInfo, placement: "bottom" }, () => h(ElIcon, () => h(InfoFilled)))
            subTipsLine.push(h('span', { class: 'kanban-indicator-cell-sub-info' }, tooltip))
        }
    } else {
        subTipsLine.push('')
    }
    children.push(h('div', { class: 'kanban-indicator-cell-sub-tip' }, subTipsLine))
    return children
}

const _default = defineComponent({
    props: {
        mainName: String,
        mainValue: String,
        subTips: Function as PropType<I18nKey>,
        subValue: String,
        subInfo: String,
    },
    setup(props) {
        return () => h('div', { class: 'kanban-indicator-cell-container' }, renderChildren(props))
    }
})

export default _default