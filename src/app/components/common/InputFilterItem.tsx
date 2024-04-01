/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElInput } from "element-plus"
import { defineComponent, ref } from "vue"

const _default = defineComponent({
    props: {
        defaultValue: String,
        placeholder: String,
    },
    emits: {
        search: (_text: string) => true
    },
    setup(props, ctx) {
        const modelValue = ref(props.defaultValue)
        return () => <ElInput class="filter-item"
            modelValue={modelValue.value}
            placeholder={props.placeholder}
            clearable
            onClear={() => ctx.emit('search', modelValue.value = '')}
            onInput={val => modelValue.value = val.trim()}
            onKeydown={(ev: KeyboardEvent) => ev.key === 'Enter' && ctx.emit("search", modelValue.value)}
            onBlur={() => ctx.emit("search", modelValue.value)}
        />
    }
})

export default _default