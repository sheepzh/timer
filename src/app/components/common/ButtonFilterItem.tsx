/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { ElButton, IconProps, ButtonType } from "element-plus"
import { defineComponent, PropType } from "vue"

const _default = defineComponent({
    props: {
        type: String as PropType<ButtonType>,
        text: String,
        icon: Object as PropType<IconProps>,
        right: {
            type: Boolean,
            default: true
        }
    },
    emits: {
        click: () => true
    },
    setup(props, ctx) {
        return () => <ElButton
            class={`filter-item${props.right ? " filter-item-right" : ""}`}
            type={props.type}
            icon={props.icon}
            onClick={() => ctx.emit("click")}
        >
            {props.text}
        </ElButton>
    }
})

export default _default