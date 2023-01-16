/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Check, Close, Edit } from "@element-plus/icons-vue"
import { defineComponent, h, nextTick, watch } from "@vue/runtime-core"
import { ElButton, ElIcon, ElInput } from "element-plus"
import { Ref, ref, SetupContext } from "vue"

type _Data = {
    editing: Ref<boolean>
    originVal: Ref<string>
    inputVal: Ref<string>
    input: Ref
}

type _Emits = {
    change: (_newVal: string) => true
}

function renderEditing(data: _Data, ctx: SetupContext<_Emits>) {
    return h(ElInput, {
        size: 'small',
        ref: data.input,
        modelValue: data.inputVal.value,
        onInput: (newVal: string) => data.inputVal.value = newVal?.trimStart(),
        onKeyup(event: KeyboardEvent) {
            if (event.key !== 'Enter') {
                return
            }
            data.editing.value = false
            ctx.emit("change", data.inputVal.value)
        }
    }, {
        append: () => [
            h(ElButton, {
                class: "cancel-btn",
                icon: Close,
                onClick: () => {
                    data.editing.value = false
                    data.inputVal.value = data.originVal.value
                }
            }),
            h(ElButton, {
                class: "save-btn",
                icon: Check,
                onClick: () => {
                    data.editing.value = false
                    ctx.emit("change", data.inputVal.value?.trim())
                }
            })
        ]
    })
}

function renderText(data: _Data) {
    const result = []
    data.inputVal.value && result.push(h("span", {
        style: { paddingRight: "4px" }
    }, data.inputVal.value))
    result.push(h(ElIcon, {
        class: "edit-btn"
    }, () => h(Edit, {
        onClick: () => {
            data.editing.value = true
            // Auto focus
            nextTick(() => data.input.value?.focus?.())
        }
    })))
    return result
}

function render(data: _Data, ctx: SetupContext<_Emits>) {
    const isEditing = data.editing.value
    if (isEditing) {
        return renderEditing(data, ctx)
    } else {
        return renderText(data)
    }
}
/**
 * @since 0.7.1
 */
const _default = defineComponent({
    name: "ReportAliasInfo",
    props: {
        modelValue: {
            type: String
        }
    },
    emits: {
        change: (_newAlias: string) => true
    },
    setup(props, ctx) {
        const editing = ref(false)
        const originVal = ref(props.modelValue)
        const inputVal = ref(originVal.value)
        const input = ref()
        watch(() => props.modelValue, (newVal) => {
            inputVal.value = originVal.value = newVal
        })
        return () => render({ editing, originVal, inputVal, input }, ctx)
    }
})

export default _default