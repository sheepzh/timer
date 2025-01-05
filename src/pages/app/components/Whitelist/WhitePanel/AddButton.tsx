/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { t } from "@app/locale"
import { useState, useSwitch } from "@hooks"
import { ElButton } from "element-plus"
import { defineComponent } from "vue"
import WhiteInput from './WhiteInput'

export type AddButtonInstance = {
    closeEdit(): void
}

const _default = defineComponent({
    emits: {
        save: (_white: string) => true,
    },
    setup(_, ctx) {
        const [editing, openEdit, closeEdit] = useSwitch(false)
        const [white, _setWhite, resetWhite] = useState('')
        ctx.expose({ closeEdit } satisfies AddButtonInstance)

        const handleAdd = () => {
            resetWhite()
            openEdit()
        }

        return () => <>
            <WhiteInput
                v-show={editing.value}
                defaultValue={white.value}
                onSave={val => ctx.emit('save', white.value = val)}
                onCancel={closeEdit}
            />
            <ElButton
                v-show={!editing.value}
                size="small"
                class="editable-item item-add-button"
                onClick={handleAdd}
            >
                {`+ ${t(msg => msg.button.create)}`}
            </ElButton>
        </>
    }
})

export default _default