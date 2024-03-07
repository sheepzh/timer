/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Check, Close } from "@element-plus/icons-vue"
import { isRemainHost } from "@util/constant/remain-host"
import { isValidHost } from "@util/pattern"
import { ElButton, ElInput, ElMessage } from "element-plus"
import { defineComponent, Ref, ref } from "vue"
import './style.sass'

const _default = defineComponent({
    props: {
        white: String,
    },
    emits: {
        save: (_white: string) => true,
        cancel: () => true,
    },
    setup(props, ctx) {
        const white: Ref<string> = ref(props.white || "")
        const input: Ref<HTMLInputElement> = ref()
        const handleSubmit = () => {
            const whiteVal = white.value
            if (isRemainHost(whiteVal) || isValidHost(white.value)) {
                ctx.emit("save", white.value)
            } else {
                ElMessage.warning(t(msg => msg.whitelist.errorInput))
            }
        }
        return () => <div class="item-input-container">
            <ElInput
                ref={input}
                class="input-new-tag editable-item whitelist-item-input"
                modelValue={white.value}
                placeholder={t(msg => msg.whitelist.placeholder)}
                clearable
                onClear={() => white.value = ''}
                onInput={val => white.value = val?.trim?.()}
            />
            <ElButton
                size="small"
                icon={<Close />}
                class="item-cancel-button editable-item"
                onClick={() => {
                    white.value = props.white
                    ctx.emit("cancel")
                }}
            />
            <ElButton
                size="small"
                icon={<Check />}
                class="item-check-button editable-item"
                onClick={handleSubmit}
            />
        </div>
    }
})

export default _default