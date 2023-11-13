/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { ElButton } from "element-plus"
import { defineComponent, h, ref, Ref } from "vue"
import ItemInput from './item-input'

export type AddButtonInstance = {
    closeEdit(): void
}

const buttonText = `+ ${t(msg => msg.button.create)}`

const _default = defineComponent({
    name: "WhitelistAddButton",
    emits: {
        save: (_white: string) => true,
    },
    setup(_props, ctx) {
        const editing: Ref<boolean> = ref(false)
        const white: Ref<string> = ref('')
        const instance: AddButtonInstance = {
            closeEdit: () => editing.value = false
        }
        ctx.expose(instance)
        return () => editing.value
            ? h(ItemInput, {
                white: white.value,
                onSave: (newWhite) => {
                    white.value = newWhite
                    ctx.emit('save', newWhite)
                },
                onCancel: () => editing.value = false
            })
            : h(ElButton, {
                size: "small",
                class: "editable-item item-add-button",
                onClick: () => {
                    white.value = ''
                    editing.value = true
                }
            },
                () => buttonText
            )
    }
})

export default _default