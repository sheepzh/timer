/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { computeRingText, RingValue, ValueFormatter } from "@app/components/Analysis/util"
import { tN, type I18nKey } from "@app/locale"
import { BottomRight, InfoFilled, TopRight } from "@element-plus/icons-vue"
import Box from "@pages/components/Box"
import Flex from "@pages/components/Flex"
import { range } from "@util/array"
import { ElIcon, ElTooltip } from "element-plus"
import { defineComponent, type CSSProperties, type PropType, type VNode } from "vue"
import type { JSX } from "vue/jsx-runtime"
import "./indicator-cell.sass"

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

function renderComparisonIcons(ring: RingValue): VNode | null {
    const [current = 0, last = 0] = ring
    if (current === last) return null
    const clz = [
        'icon-wrapper',
        current > last && 'increase',
        current < last && 'decrease',
    ]
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

function renderSub(props: SubProps): VNode | null {
    const { subTips, subValue, subInfo, subRing, valueFormatter } = props
    if (!subTips && !subValue && !subRing) {
        return null
    }

    const subTipsLine: (JSX.Element | string)[] = []
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
            <Flex inline align="center" height="100%" marginInline='2px 0px'>
                <ElTooltip content={subInfo} placement="bottom">
                    <ElIcon><InfoFilled /></ElIcon>
                </ElTooltip>
            </Flex>
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
        valueFormatter: Function as PropType<ValueFormatter>,
        containerStyle: Object as PropType<CSSProperties>,
    },
    setup(props) {
        return () => (
            <Flex
                column justify="center"
                minHeight={140}
                boxSizing="border-box"
                position="relative"
                paddingBlock={10}
                paddingInline="40px 20px"
                style={props.containerStyle}
            >
                <Box fontSize={14} color="text-secondary">{props.mainName}</Box>
                <Box fontSize={24} marginBlock='.25em .6em'>
                    {props.mainValue ?? '-'}
                </Box>
                {renderSub(props)}
            </Flex>
        )
    }
})

export default _default