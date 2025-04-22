import I18nNode from "@app/components/common/I18nNode"
import { type I18nKey } from "@app/locale"
import Flex from "@pages/components/Flex"
import { ElDivider, ElTag } from "element-plus"
import { defineComponent, h, useSlots, type VNode } from "vue"

type Props = {
    label: I18nKey
    defaultValue?: string | number
    hideDivider?: boolean
    required?: boolean
}

const _default = defineComponent<Props>(props => {
    const slots = useSlots()
    return () => {
        const param: Record<string, VNode> = {}
        Object.entries(slots).forEach(([k, slot]) => slot && (param[k === "default" ? "input" : k] = h(slot)))
        return (
            <div>
                <ElDivider v-show={!props.hideDivider} />
                <Flex class="option-line" align="center" justify="space-between" gap={10}>
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
                </Flex>
            </div>
        )
    }
}, { props: ['label', 'required', 'hideDivider', 'defaultValue'] })

export default _default