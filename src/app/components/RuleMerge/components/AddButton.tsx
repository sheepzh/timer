/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { tryParseInteger } from "@util/number"
import { ElButton } from "element-plus"
import { defineComponent, ref, Ref } from "vue"
import ItemInput from './ItemInput'

export type AddButtonInstance = {
    closeEdit(): void
}

const _default = defineComponent({
    emits: {
        save: (_origin: string, _merged: string | number) => true,
    },
    setup(_props, ctx) {
        const editing: Ref<boolean> = ref(false)
        const origin: Ref<string> = ref('')
        const merged: Ref<string | number> = ref('')
        const instance: AddButtonInstance = {
            closeEdit: () => editing.value = false
        }
        const handleEdit = () => {
            origin.value = ""
            merged.value = ""
            editing.value = true
        }
        const handleSave = (newOrigin: string, newMerged: string) => {
            const newMergedVal = tryParseInteger(newMerged?.trim())[1]
            merged.value = newMergedVal
            origin.value = newOrigin
            ctx.emit('save', newOrigin, newMergedVal)
        }
        ctx.expose(instance)
        return () => editing.value
            ? <ItemInput
                origin={origin.value}
                merged={merged.value}
                onSave={handleSave}
                onCancel={() => editing.value = false}
            />
            : <ElButton size="small" class="editable-item item-add-button" onClick={handleEdit}>
                {`+ ${t(msg => msg.button.create)}`}
            </ElButton>
    }
})

export default _default