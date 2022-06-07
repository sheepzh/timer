/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { Ref } from "vue"

import { ElSwitch } from "element-plus"
import { defineComponent, h, ref } from "vue"

const _default = defineComponent({
    name: "SwitchFilterItem",
    props: {
        defaultValue: {
            type: Boolean,
            default: false
        },
        label: String
    },
    emits: ["change"],
    setup(props, ctx) {
        const modelValue: Ref<boolean> = ref(props.defaultValue)
        return () => h("span", {}, [
            h('a', { class: 'filter-name' }, props.label),
            h(ElSwitch, {
                class: 'filter-item',
                modelValue: modelValue.value,
                onChange: (val: boolean) => ctx.emit("change", modelValue.value = val)
            })
        ])
    }
})

export default _default