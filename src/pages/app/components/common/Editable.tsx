/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Check, Close, Edit } from "@element-plus/icons-vue"
import { useShadow, useSwitch } from "@hooks"
import Flex from "@pages/components/Flex"
import { ElButton, ElIcon, ElInput, InputInstance } from "element-plus"
import { defineComponent, nextTick, ref, toRef } from "vue"

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
        const originVal = toRef(props, 'modelValue')
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
                        <ElButton
                            icon={<Close />}
                            onClick={handleCancel}
                            style={{ marginRight: 0, marginLeft: 0, paddingLeft: '2px', paddingRight: '4px' }}
                        />
                        <ElButton
                            icon={<Check />}
                            onClick={handleSave}
                            style={{ marginRight: 0, marginLeft: 0, paddingLeft: '4px', paddingRight: '2px' }}
                        />
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
                    <ElIcon style={{ cursor: 'pointer', lineHeight: '17px' }}>
                        <Edit />
                    </ElIcon>
                </Flex>
            </Flex>
    }
})

export default _default