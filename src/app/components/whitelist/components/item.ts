/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Edit } from "@element-plus/icons-vue"
import { ElTag } from "element-plus"
import { defineComponent, h, ref, Ref, watch } from "vue"
import ItemInput from "./item-input"

const _default = defineComponent({
    name: "MergeRuleItem",
    props: {
        white: {
            type: String
        },
        index: {
            type: Number
        }
    },
    emits: {
        change: (_white: string, _idx: number) => true,
        delete: (_white: string) => true,
    },
    setup(props, ctx) {
        const white: Ref<string> = ref(props.white)
        watch(() => props.white, newVal => white.value = newVal)
        const id: Ref<number> = ref(props.index || 0)
        watch(() => props.index, newVal => id.value = newVal)
        const editing: Ref<boolean> = ref(false)
        ctx.expose({
            forceEdit() {
                editing.value = true
            }
        })

        return () => editing.value
            ? h(ItemInput, {
                white: white.value,
                onSave: (newWhite: string) => {
                    editing.value = false
                    white.value = newWhite
                    ctx.emit("change", white.value, id.value)
                },
                onCancel: () => {
                    white.value = props.white
                    editing.value = false
                }
            })
            : h(ElTag, {
                class: 'editable-item',
                closable: true,
                onClose: () => ctx.emit("delete", white.value)
            }, () => [white.value, h(Edit, { class: "edit-icon", onclick: () => editing.value = true })])
    }
})

export default _default