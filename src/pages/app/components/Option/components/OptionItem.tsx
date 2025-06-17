import { tN, type I18nKey } from "@app/locale"
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
                    <Flex class="option-label" align="center" gap={4}>
                        {!!props.required && <span class="option-item-required">*</span>}
                        {tN(props.label, param)}
                    </Flex>
                    {props.defaultValue && (
                        <a class="option-default">
                            {tN(
                                msg => msg.option.defaultValue,
                                { default: <ElTag size="small">{props.defaultValue}</ElTag> },
                            )}
                        </a>
                    )}
                </Flex>
            </div>
        )
    }
}, { props: ['label', 'required', 'hideDivider', 'defaultValue'] })

export default _default