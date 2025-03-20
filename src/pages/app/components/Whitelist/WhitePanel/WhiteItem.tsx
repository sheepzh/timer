/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Edit } from "@element-plus/icons-vue"
import { useShadow, useSwitch } from "@hooks"
import { judgeVirtualFast } from "@util/pattern"
import { ElTag } from "element-plus"
import { computed, defineComponent } from "vue"
import WhiteInput from "./WhiteInput"

const _default = defineComponent({
    props: {
        white: String,
    },
    emits: {
        change: (_white: string, _openEdit: () => void) => true,
        delete: (_white: string) => true,
    },
    setup(props, ctx) {
        const [white, , resetWhite] = useShadow(() => props.white)
        const isVirtual = computed(() => !!white.value && judgeVirtualFast(white.value))
        const [editing, openEditing, closeEditing] = useSwitch()

        return () => <>
            <WhiteInput
                v-show={editing.value}
                defaultValue={white.value}
                onSave={val => {
                    closeEditing()
                    ctx.emit("change", white.value = val, openEditing)
                }}
                onCancel={() => {
                    resetWhite()
                    closeEditing()
                }}
            />
            <ElTag
                v-show={!editing.value}
                class="editable-item"
                closable
                onClose={() => white.value && ctx.emit("delete", white.value)}
                type={isVirtual.value ? 'warning' : 'primary'}
            >
                {white.value}
                <span onClick={openEditing}>
                    <Edit class="edit-icon" />
                </span>
            </ElTag>
        </>
    }
})

export default _default