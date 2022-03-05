/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Check, Close } from "@element-plus/icons"
import { isValidHost } from "@util/pattern"
import { ElButton, ElInput, ElMessage } from "element-plus"
import { defineComponent, Ref, ref, h } from "vue"
import './style.sass'

const invalidTxt = t(msg => msg.whitelist.errorInput)

const _default = defineComponent({
    name: "WhitelistItemInput",
    props: {
        white: {
            type: String,
            default: ""
        }
    },
    emits: ["saved", "canceled"],
    setup(props, ctx) {
        const white: Ref<string> = ref(props.white)
        return () => h('div', { class: "item-input-container" }, [
            h(ElInput, {
                class: 'input-new-tag editable-item whitelist-item-input',
                modelValue: white.value,
                placeholder: t(msg => msg.whitelist.placeholder),
                clearable: true,
                onClear: () => white.value = '',
                onInput: (val: string) => white.value = val.trim(),
            }),
            h(ElButton, {
                size: 'small',
                icon: Close,
                class: 'item-cancel-button editable-item',
                onClick: () => {
                    white.value = props.white
                    ctx.emit("canceled")
                }
            }),
            h(ElButton, {
                size: 'small',
                icon: Check,
                class: 'item-check-button editable-item',
                onClick: () => isValidHost(white.value) ? ctx.emit("saved", white.value) : ElMessage.warning(invalidTxt)
            })
        ])
    }
})

export default _default