/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { tryParseInteger } from "@util/number"
import { ElButton } from "element-plus"
import { defineComponent, h, ref, Ref } from "vue"
import ItemInput from './item-input'

const buttonText = `+ ${t(msg => msg.button.create)}`

export type AddButtonInstance = {
    closeEdit(): void
}

const _default = defineComponent({
    emits: {
        save: (_origin: string, _merged: string | number) => true,
    },
    setup(_props, ctx) {
        const editing: Ref<boolean> = ref(false)
        const origin: Ref<string> = ref('')
        const merged: Ref<string | number> = ref('')
        const instance: AddButtonInstance = {
            closeEdit: () => editing.value = false
        }
        ctx.expose(instance)
        return () => editing.value
            ? h(ItemInput, {
                origin: origin.value,
                merged: merged.value,
                onSave: (newOrigin, newMerged) => {
                    const newMergedVal = tryParseInteger(newMerged?.trim())[1]
                    merged.value = newMergedVal
                    origin.value = newOrigin
                    ctx.emit('save', newOrigin, newMergedVal)
                },
                onCancel: () => editing.value = false
            })
            : h(ElButton, {
                size: "small",
                class: "editable-item item-add-button",
                onClick: () => {
                    origin.value = ""
                    merged.value = ""
                    editing.value = true
                }
            },
                () => buttonText
            )
    }
})

export default _default