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

const invalidTxt = t(msg => msg.mergeRule.errorOrigin)

const _default = defineComponent({
    name: "WhitelistItemInput",
    props: {
        origin: {
            type: String,
            defaultValue: ""
        },
        merged: {
            type: [String, Number],
            defaultValue: ""
        }
    },
    emits: ["saved", "canceled"],
    setup(props, ctx) {
        const origin: Ref<string> = ref(props.origin)
        const merged: Ref<string> = ref(props.merged?.toString())
        return () => h('div', { class: "item-input-container" }, [
            h(ElInput, {
                class: 'input-new-tag white-item merge-origin-input',
                modelValue: origin.value,
                placeholder: t(msg => msg.mergeRule.originPlaceholder),
                clearable: true,
                onClear: () => origin.value = '',
                onInput: (val: string) => origin.value = val.trim(),
            }),
            h(ElInput, {
                class: 'input-new-tag white-item merge-merged-input',
                modelValue: merged.value,
                placeholder: t(msg => msg.mergeRule.mergedPlaceholder),
                clearable: true,
                onClear: () => merged.value = '',
                onInput: (val: string) => merged.value = val.trim(),
            }),
            h(ElButton, {
                size: 'small',
                icon: Close,
                class: 'item-cancel-button white-item',
                onClick: () => {
                    origin.value = props.origin
                    merged.value = props.merged?.toString()
                    ctx.emit("canceled")
                }
            }),
            h(ElButton, {
                size: 'small',
                icon: Check,
                class: 'item-check-button white-item',
                onClick: () => isValidHost(origin.value) ? ctx.emit("saved", origin.value, merged.value) : ElMessage.warning(invalidTxt)
            })
        ])
    }
})

export default _default