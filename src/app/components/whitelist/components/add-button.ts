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

const buttonText = `+ ${t(msg => msg.operation.newOne)}`

const _default = defineComponent({
    name: "WhitelistAddButton",
    emits: ["saved"],
    setup(_props, ctx) {
        const editing: Ref<boolean> = ref(false)
        const white: Ref<string> = ref('')
        ctx.expose({
            closeEdit() {
                editing.value = false
            }
        })
        return () => editing.value
            ? h(ItemInput, {
                white: white.value,
                onSaved: (newWhite) => {
                    white.value = newWhite
                    ctx.emit('saved', newWhite)
                },
                onCanceled: () => editing.value = false
            })
            : h(ElButton, {
                size: "small",
                class: "editable-item item-add-button",
                onClick: () => {
                    white.value
                    editing.value = true
                }
            },
                () => buttonText
            )
    }
})

export default _default