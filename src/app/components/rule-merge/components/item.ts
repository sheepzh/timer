/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Edit } from "@element-plus/icons-vue"
import { tryParseInteger } from "@util/number"
import { ElTag } from "element-plus"
import { computed, defineComponent, h, ref, Ref, watch } from "vue"
import ItemInput from "./item-input"

function computeType(mergedVal: number | string): '' | 'info' | 'success' {
    return typeof mergedVal === 'number' ? 'success' : mergedVal === '' ? 'info' : ''
}

function computeTxt(mergedVal: number | string) {
    return typeof mergedVal === 'number'
        ? t(msg => msg.mergeRule.resultOfLevel, { level: mergedVal + 1 })
        : mergedVal === '' ? t(msg => msg.mergeRule.resultOfOrigin) : mergedVal
}

const _default = defineComponent({
    name: "MergeRuleItem",
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
    emits: ["changed", "deleted"],
    setup(props, ctx) {
        const origin: Ref<string> = ref(props.origin)
        watch(() => props.origin, newVal => origin.value = newVal)
        const merged: Ref<string | number> = ref(props.merged)
        watch(() => props.merged, newVal => merged.value = newVal)
        const id: Ref<number> = ref(props.index || 0)
        watch(() => props.index, newVal => id.value = newVal)
        const editing: Ref<boolean> = ref(false)
        const type: Ref<'' | 'info' | 'success'> = computed(() => computeType(merged.value))
        const txt: Ref<string> = computed(() => computeTxt(merged.value))
        ctx.expose({
            forceEdit() {
                editing.value = true
            }
        })

        return () => editing.value
            ? h(ItemInput, {
                origin: origin.value,
                merged: merged.value,
                onSaved: (newOrigin: string, newMerged: string) => {
                    origin.value = newOrigin
                    const newMergedVal = tryParseInteger(newMerged?.trim())[1]
                    merged.value = newMergedVal
                    editing.value = false
                    ctx.emit("changed", newOrigin, newMergedVal, id.value)
                },
                onCanceled: () => {
                    origin.value = props.origin
                    merged.value = props.merged
                    editing.value = false
                }
            })
            : h(ElTag, {
                class: 'editable-item',
                type: type.value,
                closable: true,
                onClose: () => ctx.emit("deleted", origin.value)
            }, () => [`${origin.value}  >>>  ${txt.value}`, h(Edit, { class: "edit-icon", onclick: () => editing.value = true })])
    }
})

export default _default