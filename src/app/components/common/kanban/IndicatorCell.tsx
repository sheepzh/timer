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
import { InfoFilled } from "@element-plus/icons-vue"

export type IndicatorProps = {
    mainName: string
    mainValue: string
    subTips?: I18nKey
    subValue?: string
    subInfo?: string
}

function renderSub(props: IndicatorProps): VNode {
    const { subTips, subValue, subInfo } = props
    if (!subTips && !subValue) {
        return null
    }

    const subTipsLine = []
    const subValueSpan = <span class="kanban-indicator-cell-sub-val">{subValue ?? '-'}</span>
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
    return <div class="kanban-indicator-cell-sub-tip">{subTipsLine}</div>
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
        const { mainName, mainValue } = props
        return () => (
            <div class="kanban-indicator-cell-container">
                <div class="kanban-indicator-cell-name">{mainName}</div>
                <div class="kanban-indicator-cell-val">{mainValue ?? '-'}</div>
                {renderSub(props)}
            </div>
        )
    }
})

export default _default