/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Check, Close } from "@element-plus/icons-vue"
import { isValidHost } from "@util/pattern"
import { ElButton, ElInput, ElMessage } from "element-plus"
import { defineComponent } from "vue"
import './style.sass'
import { useState } from "@hooks"

const _default = defineComponent({
    props: {
        origin: String,
        merged: [String, Number],
    },
    emits: {
        save: (_origin: string, _merged: string) => true,
        cancel: () => true,
    },
    setup(props, ctx) {
        const [origin, setOrigin, resetOrigin] = useState(props.origin || "")
        const [merged, setMerged, resetMerged] = useState(props.merged?.toString() || "")

        const handleSave = () => {
            const originVal = origin.value
            const mergedVal = merged.value
            if (isValidHost(originVal)) {
                ctx.emit("save", originVal, mergedVal)
            } else {
                ElMessage.warning(t(msg => msg.mergeRule.errorOrigin))
            }
        }
        return () => (
            <div class="item-input-container">
                <ElInput
                    class="input-new-tag editable-item merge-origin-input"
                    modelValue={origin.value}
                    placeholder={t(msg => msg.mergeRule.originPlaceholder)}
                    clearable
                    onClear={() => setOrigin()}
                    onInput={setOrigin}
                />
                <ElInput
                    class="input-new-tag editable-item merge-merged-input"
                    modelValue={merged.value}
                    placeholder={t(msg => msg.mergeRule.mergedPlaceholder)}
                    clearable
                    onClear={() => setMerged()}
                    onInput={setMerged}
                />
                <ElButton
                    size="small"
                    icon={<Close />}
                    class="item-cancel-button editable-item"
                    onClick={() => {
                        resetOrigin()
                        resetMerged()
                        ctx.emit("cancel")
                    }}
                />
                <ElButton
                    size="small"
                    icon={<Check />}
                    class="item-check-button editable-item"
                    onClick={handleSave}
                />
            </div>
        )
    }
})

export default _default