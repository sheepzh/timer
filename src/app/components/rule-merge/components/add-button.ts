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

const buttonText = `+ ${t(msg => msg.operation.newOne)}`

const _default = defineComponent({
    name: "AddButton",
    emits: ["saved"],
    setup(_props, ctx) {
        const editing: Ref<boolean> = ref(false)
        const inputRef: Ref = ref()
        const origin: Ref<string> = ref('')
        const merged: Ref<string | number> = ref('')
        ctx.expose({
            closeEdit() {
                editing.value = false
            }
        })
        return () => editing.value
            ? h(ItemInput, {
                ref: inputRef,
                origin: origin.value,
                merged: merged.value,
                onSaved: (newOrigin, newMerged) => {
                    const newMergedVal = tryParseInteger(newMerged?.trim())[1]
                    merged.value = newMergedVal
                    origin.value = newOrigin
                    ctx.emit('saved', newOrigin, newMergedVal)
                },
                onCanceled: () => editing.value = false
            })
            : h(ElButton, {
                size: "small",
                class: "white-item item-add-button",
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