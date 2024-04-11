/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { tryParseInteger } from "@util/number"
import { ElButton } from "element-plus"
import { defineComponent } from "vue"
import ItemInput from './ItemInput'
import { useState, useSwitch } from "@hooks"

export type AddButtonInstance = {
    closeEdit(): void
}

const _default = defineComponent({
    emits: {
        save: (_origin: string, _merged: string | number) => true,
    },
    setup(_props, ctx) {
        const [editing, startEdit, closeEdit] = useSwitch()
        const [origin, , resetOrigin] = useState('')
        const [merged, , resetMerged] = useState<string | number>('')
        const handleEdit = () => {
            resetOrigin()
            resetMerged()
            startEdit()
        }
        const handleSave = (newOrigin: string, newMerged: string) => {
            const newMergedVal = tryParseInteger(newMerged?.trim())[1]
            merged.value = newMergedVal
            origin.value = newOrigin
            ctx.emit('save', newOrigin, newMergedVal)
        }
        ctx.expose({ closeEdit } satisfies AddButtonInstance)
        return () => editing.value
            ? <ItemInput
                origin={origin.value}
                merged={merged.value}
                onSave={handleSave}
                onCancel={closeEdit}
            />
            : <ElButton size="small" class="editable-item item-add-button" onClick={handleEdit}>
                {`+ ${t(msg => msg.button.create)}`}
            </ElButton>
    }
})

export default _default