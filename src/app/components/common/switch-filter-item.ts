/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import { ElSwitch } from "element-plus"
import { defineComponent, h, nextTick, ref } from "vue"
import { useRoute } from "vue-router"
import FilterItemHistoryWrapper from "./filter-item-history-wrapper"

type _Props = {
    defaultValue?: boolean
    historyName?: string
    label: string
}

const _default = defineComponent({
    name: "SwitchFilterItem",
    emits: {
        change: (_val: boolean) => true
    },
    props: {
        label: String,
        defaultValue: {
            type: Boolean,
            required: false,
        },
        historyName: {
            type: String,
            required: false,
        }
    },
    setup(props, ctx) {
        const modelValue: Ref<boolean> = ref(props.defaultValue || false)
        const historyWrapper = new FilterItemHistoryWrapper(useRoute().path, props.historyName)
        // Initiliaze value
        historyWrapper.ifPresent(
            historyVal => nextTick(() => ctx.emit('change', (modelValue.value = historyVal === 'true')))
        )
        return () => h("span", { class: "filter-switch" }, [
            h('a', { class: 'filter-name' }, props.label),
            h(ElSwitch, {
                class: 'filter-item',
                modelValue: modelValue.value,
                onChange(val: boolean) {
                    ctx.emit("change", modelValue.value = val)
                    historyWrapper.setValue(modelValue.value?.toString?.())
                }
            })
        ])
    }
})

export default _default