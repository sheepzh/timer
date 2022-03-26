/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Check, Close, Edit } from "@element-plus/icons"
import { defineComponent, h, nextTick, watch } from "@vue/runtime-core"
import { ElButton, ElIcon, ElInput } from "element-plus"
import { Ref, ref, SetupContext } from "vue"

type _Data = {
    editing: Ref<boolean>
    val: Ref<string>
    input: Ref
    outVal: string
}

type _Emits = "change"

function renderEditing(data: _Data, ctx: SetupContext<_Emits[]>) {
    return h(ElInput, {
        size: "mini",
        ref: data.input,
        modelValue: data.val.value,
        onInput: (newVal: string) => data.val.value = newVal?.trimStart()
    }, {
        append: () => [
            h(ElButton, {
                class: "cancel-btn",
                icon: Close,
                onClick: () => {
                    data.editing.value = false
                }
            }),
            h(ElButton, {
                class: "save-btn",
                icon: Check,
                onClick: () => {
                    data.editing.value = false
                    ctx.emit("change", data.val.value?.trim())
                }
            })
        ]
    })
}

function renderText(data: _Data) {
    const result = []
    data.val.value && result.push(h("span", {
        style: { paddingRight: "4px" }
    }, data.val.value))
    result.push(h(ElIcon, {
        size: 17,
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

function render(data: _Data, ctx) {
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
    emits: ['change'],
    setup(props, ctx) {
        const editing = ref(false)
        const val = ref(props.modelValue)
        const outVal = props.modelValue
        const input = ref()
        watch(() => props.modelValue, (newVal) => {
            val.value = newVal
        })
        return () => render({ editing, val, outVal, input }, ctx)
    }
})

export default _default