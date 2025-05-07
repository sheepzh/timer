/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import EditableTag from "@app/components/common/EditableTag"
import { useShadow, useSwitch } from "@hooks"
import { judgeVirtualFast } from "@util/pattern"
import { computed, defineComponent } from "vue"
import WhiteInput from "./WhiteInput"

type Props = {
    white: string
    onChange: (white: string) => Promise<boolean>
    onDelete: (white: string) => void
}

const _default = defineComponent<Props>(props => {
    const [white, , resetWhite] = useShadow(() => props.white)
    const isVirtual = computed(() => !!white.value && judgeVirtualFast(white.value))
    const [editing, openEditing, closeEditing] = useSwitch()

    const handleCancel = () => {
        resetWhite()
        closeEditing()
    }

    return () => editing.value ? (
        <WhiteInput
            defaultValue={white.value}
            onSave={val => props.onChange?.(white.value = val)?.then(succ => succ && closeEditing())}
            onCancel={handleCancel}
        />
    ) : (
        <EditableTag
            text={white.value}
            onEdit={openEditing}
            onClose={() => white.value && props.onDelete(white.value)}
            type={isVirtual.value ? 'warning' : 'primary'}
        />
    )
}, { props: ['white', 'onChange', 'onDelete'] })

export default _default