/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { I18nKey } from "@app/locale"
import type { PropType, VNode } from "vue"

import { tN } from "@app/locale"
import { defineComponent } from "vue"
import "./indicator-cell.sass"
import { ElIcon, ElTooltip } from "element-plus"
import { BottomRight, InfoFilled, TopRight } from "@element-plus/icons-vue"
import { computeRingText, RingValue, ValueFormatter } from "@app/components/Analysis/util"
import { classNames } from "@util/style"
import { range } from "@util/array"

export type SubProps = {
    subTips?: I18nKey
    subValue?: string
    subInfo?: string
    subRing?: RingValue
    valueFormatter?: ValueFormatter
}

function renderSubVal(valText: string) {
    return <span class="kanban-indicator-cell-sub-val">{valText}</span>
}

function renderComparisonIcons(ring: RingValue): VNode {
    const [current = 0, last = 0] = ring
    if (current === last) return null
    const clz = classNames(
        'icon-wrapper',
        current > last && 'increase',
        current < last && 'decrease',
    )
    const icon = current > last ? <TopRight /> : <BottomRight />
    let count = 0
    if (current === 0 || last === 0) {
        count = 3
    } else {
        // rate not in {0, 1, infinite}
        // so log2(rate) not in {-infinite, 0, +infinite}
        const rate = current / last
        count = Math.min(Math.ceil(Math.abs(Math.log2(rate))), 3)
    }
    if (!count) return null
    const icons = range(count).map(() => <ElIcon>{icon}</ElIcon>)
    return <div class={clz}>{icons}</div>
}

function renderSub(props: SubProps): VNode {
    const { subTips, subValue, subInfo, subRing, valueFormatter } = props
    if (!subTips && !subValue && !subRing) {
        return null
    }

    const subTipsLine = []
    if (subRing) {
        const ringText = computeRingText(subRing, valueFormatter)
        if (ringText) {
            const subValueSpan = renderSubVal(ringText)
            subTipsLine.push(subValueSpan)
            const icons = renderComparisonIcons(subRing)
            icons && subTipsLine.push(icons)
        } else {
            const subValueSpan = renderSubVal('-')
            subTipsLine.push(subValueSpan)
        }
    } else {
        const subValueSpan = renderSubVal(subValue ?? '-')
        if (subTips) {
            subTipsLine.push(...tN(subTips, { value: subValueSpan }))
        } else {
            subTipsLine.push(subValueSpan)
        }
        subInfo && subTipsLine.push(
            <span class="kanban-indicator-cell-sub-info">
                <ElTooltip content={subInfo} placement="bottom">
                    <ElIcon><InfoFilled /></ElIcon>
                </ElTooltip>
            </span>
        )
    }
    return <div class="kanban-indicator-cell-sub-tip">{subTipsLine}</div>
}

const _default = defineComponent({
    props: {
        mainName: String,
        mainValue: String,
        subTips: Function as PropType<I18nKey>,
        subValue: String,
        subInfo: String,
        subRing: [Object, Object] as PropType<RingValue>,
        valueFormatter: Function as PropType<ValueFormatter>
    },
    setup(props) {
        return () => (
            <div class="kanban-indicator-cell-container">
                <div class="kanban-indicator-cell-name">{props.mainName}</div>
                <div class="kanban-indicator-cell-val">{props.mainValue ?? '-'}</div>
                {renderSub(props)}
            </div>
        )
    }
})

export default _default