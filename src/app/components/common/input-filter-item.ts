/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElInput } from "element-plus"
import { defineComponent, h, Ref, ref } from "vue"

const _default = defineComponent({
    name: "InputFilterItem",
    props: {
        defaultValue: {
            type: String,
            required: false,
        },
        placeholder: String,
    },
    emits: {
        search: (_text: string) => true
    },
    setup(props, ctx) {
        const modelValue: Ref<string> = ref(props.defaultValue)
        return () => h(ElInput, {
            class: 'filter-item',
            modelValue: modelValue.value,
            placeholder: props.placeholder,
            clearable: true,
            onClear() {
                modelValue.value = ''
                ctx.emit("search", "")
            },
            onInput: (val: string) => modelValue.value = val.trim(),
            onKeyup: (event: KeyboardEvent) => event.key === 'Enter' && ctx.emit("search", modelValue.value),
            onBlur: (_event: FocusEvent) => ctx.emit("search", modelValue.value),
        })
    }
})

export default _default