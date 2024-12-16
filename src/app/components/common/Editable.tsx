/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Check, Close, Edit } from "@element-plus/icons-vue"
import { useShadow, useSwitch } from "@hooks"
import { ElButton, ElIcon, ElInput, InputInstance } from "element-plus"
import { defineComponent, nextTick, ref } from "vue"
import Flex from "./Flex"

/**
 * @since 0.7.1
 */
const _default = defineComponent({
    props: {
        modelValue: String
    },
    emits: {
        change: (_newVal: string) => true
    },
    setup(props, ctx) {
        const [editing, openEditing, closeEditing] = useSwitch(false)
        const [originVal] = useShadow(() => props.modelValue)
        const [inputVal, _, refreshInputVal] = useShadow(originVal)
        const input = ref<InputInstance>()
        const handleEnter = (ev: KeyboardEvent) => {
            if (ev.key !== 'Enter') return
            closeEditing()
            ctx.emit("change", inputVal.value)
        }
        const handleCancel = () => {
            closeEditing()
            refreshInputVal()
        }
        const handleSave = () => {
            closeEditing()
            ctx.emit("change", inputVal.value?.trim())
        }
        const handleEdit = () => {
            openEditing()
            nextTick(() => input.value?.focus?.())
        }
        const labelSlot = ctx.slots?.label
        return () => editing.value
            ? <ElInput
                size="small"
                ref={input}
                modelValue={inputVal.value}
                onInput={val => inputVal.value = val?.trimStart()}
                onKeydown={handleEnter}
                v-slots={{
                    append: () => <>
                        <ElButton class="cancel-btn" icon={<Close />} onClick={handleCancel} />
                        <ElButton class="save-btn" icon={<Check />} onClick={handleSave} />
                    </>
                }}
            />
            : <Flex justify="center" gap={4}>
                {labelSlot ? labelSlot(inputVal.value) : inputVal.value && <span>{inputVal.value}</span>}
                <Flex
                    onClick={handleEdit}
                    align="center"
                    wrap="wrap"
                    style={{ paddingTop: '2px' }}
                >
                    <ElIcon class="edit-btn">
                        <Edit />
                    </ElIcon>
                </Flex>
            </Flex>
    }
})

export default _default