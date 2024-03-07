/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { ElButton } from "element-plus"
import { defineComponent, ref, Ref } from "vue"
import WhiteInput from './WhiteInput'

export type AddButtonInstance = {
    closeEdit(): void
}

const _default = defineComponent({
    emits: {
        save: (_white: string) => true,
    },
    setup(_, ctx) {
        const editing: Ref<boolean> = ref(false)
        const white: Ref<string> = ref('')
        const instance: AddButtonInstance = {
            closeEdit: () => editing.value = false
        }
        ctx.expose(instance)

        return () => editing.value
            ? <WhiteInput
                white={white.value}
                onSave={val => ctx.emit('save', white.value = val)}
                onCancel={() => editing.value = false}
            />
            : <ElButton size="small" class="editable-item item-add-button" onClick={() => {
                white.value = ""
                editing.value = true
            }}>
                {`+ ${t(msg => msg.button.create)}`}
            </ElButton>
    }
})

export default _default