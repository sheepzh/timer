import I18nNode from "@app/components/common/I18nNode"
import { type I18nKey } from "@app/locale"
import { ElDivider, ElTag } from "element-plus"
import { defineComponent, h, type PropType, type VNode } from "vue"

const _default = defineComponent({
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
        required: Boolean
    },
    setup: (props, ctx) => {
        return () => {
            const param: Record<string, VNode> = {}
            Object.entries(ctx.slots).forEach(([k, slot]) => param[k === "default" ? "input" : k] = h(slot))
            return (
                <div>
                    <ElDivider v-show={!props.hideDivider} />
                    <div class="option-line">
                        <a class="option-label">
                            {!!props.required && <span class="option-item-required">*</span>}
                            <I18nNode path={props.label} param={param} />
                        </a>
                        {props.defaultValue && (
                            <a class="option-default">
                                <I18nNode
                                    path={msg => msg.option.defaultValue}
                                    param={{ default: <ElTag size="small">{props.defaultValue}</ElTag> }}
                                />
                            </a>
                        )}
                    </div>
                </div>
            )
        }
    }
})

export default _default