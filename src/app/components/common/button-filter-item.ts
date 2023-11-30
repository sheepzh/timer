/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElButton, IconProps, ButtonType } from "element-plus"
import { defineComponent, PropType, h, Ref, computed } from "vue"

const _default = defineComponent({
    name: "ButtonFilterItem",
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
        const clz: Ref<string> = computed(() => `filter-item${props.right ? " filter-item-right" : ""}`)
        return () => h(ElButton, {
            class: clz.value,
            type: props.type,
            icon: props.icon,
            onClick: () => ctx.emit("click")
        }, () => props.text)
    }
})

export default _default