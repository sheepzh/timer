/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { MergeTagType } from "@util/merge"
import type { Ref } from "vue"

import { t } from "@app/locale"
import { Edit } from "@element-plus/icons-vue"
import { tryParseInteger } from "@util/number"
import { ElTag } from "element-plus"
import { computed, defineComponent, h, ref, watch } from "vue"
import ItemInput from "./item-input"
import { computeMergeTxt, computeMergeType } from "@util/merge"

export type ItemInstance = {
    forceEdit(): void
}

const _default = defineComponent({
    props: {
        origin: {
            type: String
        },
        merged: {
            type: [String, Number]
        },
        index: {
            type: Number
        }
    },
    emits: {
        change: (_origin: string, _merged: string | number, _idx: number) => true,
        delete: (_origin: string) => true,
    },
    setup(props, ctx) {
        const origin: Ref<string> = ref(props.origin)
        watch(() => props.origin, newVal => origin.value = newVal)
        const merged: Ref<string | number> = ref(props.merged)
        watch(() => props.merged, newVal => merged.value = newVal)
        const id: Ref<number> = ref(props.index || 0)
        watch(() => props.index, newVal => id.value = newVal)
        const editing: Ref<boolean> = ref(false)
        const type: Ref<MergeTagType> = computed(() => computeMergeType(merged.value))
        const tagTxt: Ref<string> = computed(() => computeMergeTxt(origin.value, merged.value,
            (finder, param) => t(msg => finder(msg.mergeCommon), param)
        ))
        const instance: ItemInstance = {
            forceEdit: () => editing.value = true
        }
        ctx.expose(instance)

        return () => editing.value
            ? h(ItemInput, {
                origin: origin.value,
                merged: merged.value,
                onSave: (newOrigin: string, newMerged: string) => {
                    origin.value = newOrigin
                    const newMergedVal = tryParseInteger(newMerged?.trim())[1]
                    merged.value = newMergedVal
                    editing.value = false
                    ctx.emit("change", newOrigin, newMergedVal, id.value)
                },
                onCancel: () => {
                    origin.value = props.origin
                    merged.value = props.merged
                    editing.value = false
                }
            })
            : h(ElTag, {
                class: 'editable-item',
                type: type.value,
                closable: true,
                onClose: () => ctx.emit("delete", origin.value)
            }, () => [
                tagTxt.value,
                h(Edit, { class: "edit-icon", onclick: () => editing.value = true })
            ])
    }
})

export default _default