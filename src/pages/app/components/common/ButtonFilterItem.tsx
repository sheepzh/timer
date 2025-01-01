/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { classNames } from "@util/style"
import { type ButtonType, ElButton } from "element-plus"
import { defineComponent, type PropType } from "vue"
import { type JSX } from "vue/jsx-runtime"

const _default = defineComponent({
    props: {
        type: String as PropType<ButtonType>,
        text: String,
        icon: Object as PropType<JSX.Element>,
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
            class={classNames('filter-item', props.right && 'filter-item-right')}
            type={props.type}
            icon={props.icon}
            onClick={() => ctx.emit("click")}
        >
            {props.text}
        </ElButton>
    }
})

export default _default