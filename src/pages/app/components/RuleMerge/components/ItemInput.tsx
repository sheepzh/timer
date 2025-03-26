/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Check, Close } from "@element-plus/icons-vue"
import { useShadow } from "@hooks"
import { LOCAL_HOST_PATTERN } from "@util/constant/remain-host"
import { tryParseInteger } from "@util/number"
import { isValidHost } from "@util/pattern"
import { ElButton, ElInput, ElMessage } from "element-plus"
import { computed, defineComponent } from "vue"
import './style.sass'

const _default = defineComponent({
    props: {
        origin: String,
        merged: [String, Number],
    },
    emits: {
        save: (_origin: string, _merged: string | number) => true,
        cancel: () => true,
    },
    setup(props, ctx) {
        const [origin, setOrigin, resetOrigin] = useShadow(() => props.origin, '')
        const [merged, setMerged, resetMerged] = useShadow(() => props.merged, '')

        const mergedTxt = computed({
            get() {
                const mergedVal = merged.value
                if (typeof mergedVal === 'number') return `${mergedVal + 1}`
                else return mergedVal
            },
            set(val: string) {
                const newVal = tryParseInteger(val?.trim())[1]
                setMerged(typeof newVal === 'number' ? newVal - 1 : newVal)
            },
        })

        const handleSave = () => {
            const originVal = origin.value
            const mergedVal = merged.value
            if (originVal && mergedVal && isValidHost(originVal)) {
                ctx.emit("save", originVal, mergedVal)
            } else {
                ElMessage.warning(t(msg => msg.mergeRule.errorOrigin))
            }
        }

        const handleCancel = () => {
            resetOrigin()
            resetMerged()
            ctx.emit("cancel")
        }

        return () => (
            <div class="item-input-container">
                <ElInput
                    class="input-new-tag editable-item merge-origin-input"
                    modelValue={origin.value}
                    placeholder={t(msg => msg.mergeRule.originPlaceholder)}
                    clearable
                    onClear={() => setOrigin(undefined)}
                    onInput={setOrigin}
                    disabled={origin.value === LOCAL_HOST_PATTERN}
                />
                <ElInput
                    class="input-new-tag editable-item merge-merged-input"
                    modelValue={mergedTxt.value}
                    placeholder={t(msg => msg.mergeRule.mergedPlaceholder)}
                    clearable
                    onClear={() => mergedTxt.value = ''}
                    onInput={val => mergedTxt.value = val}
                />
                <ElButton
                    size="small"
                    icon={<Close />}
                    class="item-cancel-button editable-item"
                    onClick={handleCancel}
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