/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElementButtonType } from "@app/element-ui/button"
import ElementIcon from "@app/element-ui/icon"
import { ElButton } from "element-plus"
import { defineComponent, PropType, h, Ref, computed } from "vue"

const _default = defineComponent({
    name: "ButtonFilterItem",
    props: {
        type: String as PropType<ElementButtonType>,
        text: String,
        icon: Object as PropType<ElementIcon>,
        right: {
            type: Boolean,
            default: true
        }
    },
    emits: ["click"],
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