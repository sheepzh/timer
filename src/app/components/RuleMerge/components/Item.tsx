/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { t } from "@app/locale"
import { Edit } from "@element-plus/icons-vue"
import { useShadow, useSwitch } from "@hooks"
import { LOCAL_HOST_PATTERN } from "@util/constant/remain-host"
import { ElTag, TagProps } from "element-plus"
import { computed, defineComponent } from "vue"
import ItemInput from "./ItemInput"

export type ItemInstance = {
    forceEdit(): void
}

function computeMergeTxt(mergedVal: number | string,): string {
    if (typeof mergedVal === 'number') {
        return t(msg => msg.mergeCommon.tagResult.level, { level: mergedVal + 1 })
    }
    if (!mergedVal) return t(msg => msg.mergeCommon.tagResult.blank)
    return mergedVal
}

function computeMergeType(mergedVal: number | string): TagProps["type"] {
    if (typeof mergedVal === 'number') return 'success'
    if (!mergedVal) return 'info'
    return null
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
        const [origin, , refreshOrigin] = useShadow(() => props.origin)
        const [merged, , refreshMerged] = useShadow(() => props.merged, '')

        const [editing, openEditing, closeEditing] = useSwitch()
        const type = computed(() => computeMergeType(merged.value))
        const mergeText = computed(() => computeMergeTxt(merged.value))

        ctx.expose({ forceEdit: openEditing } satisfies ItemInstance)

        const handleSave = (newOrigin: string, newMerged: string | number) => {
            closeEditing()
            ctx.emit("change", newOrigin, newMerged)
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
                closable={LOCAL_HOST_PATTERN !== origin.value}
                onClose={() => ctx.emit("delete", props.origin)}
            >
                <div class="tag-content">
                    <span dir="ltr">{origin.value}</span>
                    <span>{'>>>'}</span>
                    <span>{mergeText.value}</span>
                </div>
                <i onClick={openEditing}>
                    <Edit class="edit-icon" />
                </i>
            </ElTag>
    }
})

export default _default