/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { t } from "@app/locale"
import { Edit } from "@element-plus/icons-vue"
import { useShadow, useSwitch } from "@hooks"
import { computeMergeTxt, computeMergeType } from "@util/merge"
import { tryParseInteger } from "@util/number"
import { ElTag } from "element-plus"
import { computed, defineComponent } from "vue"
import ItemInput from "./ItemInput"

export type ItemInstance = {
    forceEdit(): void
}

const _default = defineComponent({
    props: {
        origin: String,
        merged: [String, Number],
    },
    emits: {
        change: (_origin: string, _merged: string | number) => true,
        delete: (_origin: string) => true,
    },
    setup(props, ctx) {
        const [origin, setOrigin, refreshOrigin] = useShadow(() => props.origin)
        const [merged, setMerged, refreshMerged] = useShadow(() => {
            const mergedVal = props.merged
            return typeof mergedVal === 'number' ? mergedVal + 1 : mergedVal
        }, '')
        const [editing, openEditing, closeEditing] = useSwitch()
        const type = computed(() => computeMergeType(merged.value))
        const tagTxt = computed(() => computeMergeTxt(origin.value, merged.value,
            (finder, param) => t(msg => finder(msg.mergeCommon), param)
        ))
        ctx.expose({ forceEdit: openEditing } satisfies ItemInstance)

        const handleSave = (newOrigin: string, newMerged: string) => {
            setOrigin(newOrigin)
            const newMergedVal = tryParseInteger(newMerged?.trim())[1]
            setMerged(newMergedVal)
            closeEditing()
            ctx.emit("change", newOrigin, newMergedVal)
        }

        const handleCancel = () => {
            refreshOrigin()
            refreshMerged()
            closeEditing()
        }

        return () => editing.value
            ? <ItemInput
                origin={origin.value}
                merged={merged.value}
                onSave={handleSave}
                onCancel={handleCancel}
            />
            : <ElTag
                class="editable-item"
                type={type.value}
                closable
                onClose={() => ctx.emit("delete", props.origin)}
            >
                {tagTxt.value}
                <i onClick={openEditing}>
                    <Edit class="edit-icon" />
                </i>
            </ElTag>
    }
})

export default _default