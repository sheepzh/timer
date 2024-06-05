/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { InfoFilled } from "@element-plus/icons-vue"
import { ElTag, ElTooltip, ElIcon, ElDivider } from "element-plus"
import { defineComponent, h, PropType, useSlots, VNode } from "vue"
import { I18nKey } from "@app/locale"
import I18nNode from "../common/I18nNode"

export const OptionItem = defineComponent({
    props: {
        label: {
            type: Function as PropType<I18nKey>,
            required: true,
        },
        defaultValue: [String, Number],
        hideDivider: {
            type: Boolean,
            default: false,
        },
    },
    setup: (props, ctx) => {
        return () => {
            const param: Record<string, VNode> = {}
            Object.entries(ctx.slots).forEach(([k, slot]) => param[k === "default" ? "input" : k] = h(slot))
            return (
                <div class="test">
                    <ElDivider v-show={!props.hideDivider} />
                    <div class="option-line">
                        <a class="option-label">
                            <I18nNode path={props.label} param={param} />
                        </a>
                        {
                            props.defaultValue && <a class="option-default">
                                <I18nNode
                                    path={msg => msg.option.defaultValue}
                                    param={{ default: <ElTag size="small">{props.defaultValue}</ElTag> }}
                                />
                            </a>
                        }
                    </div>
                </div>
            )
        }
    }
})

export const OptionTag = defineComponent({
    render: () => <a class="option-tag">{h(useSlots().default)}</a>
})

export const OptionTooltip = defineComponent({
    render: () => {
        const content = useSlots().default
        if (!content) {
            return null
        }
        return (
            <ElTooltip v-slots={{ content }}>
                <ElIcon size={15}>
                    <InfoFilled />
                </ElIcon>
            </ElTooltip>
        )
    }
})

export type OptionInstance = {
    reset: () => Promise<void> | void
}