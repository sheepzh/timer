/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Edit } from "@element-plus/icons-vue"
import { ElTag } from "element-plus"
import { defineComponent, ref, Ref, watch } from "vue"
import WhiteInput from "./WhiteInput"

export type ItemInstance = {
    forceEdit(): void
}

const _default = defineComponent({
    props: {
        white: String,
        index: Number,
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
        const instance: ItemInstance = {
            forceEdit: () => editing.value = true
        }
        ctx.expose(instance)
        return () => editing.value
            ? <WhiteInput
                white={white.value}
                onSave={val => {
                    editing.value = false
                    ctx.emit("change", white.value = val, id.value)
                }}
                onCancel={() => {
                    white.value = props.white
                    editing.value = false
                }}
            />
            : <ElTag
                class="editable-item"
                closable onClose={() => ctx.emit("delete", white.value)}
            >
                {white.value}
                <span onClick={() => editing.value = true}>
                    <Edit class="edit-icon" />
                </span>
            </ElTag>
    }
})

export default _default