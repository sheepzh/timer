/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { nextTick, Ref } from "vue"
import type { RouteLocation } from "vue-router"

import { ElSwitch } from "element-plus"
import { defineComponent, h, ref } from "vue"
import { useRoute } from "vue-router"
import FilterItemHistoryWrapper from "./filter-item-history-wrapper"

const PREFIX = "__filter_select_history_value_"

function calcHistoryKey(route: RouteLocation, historyName: string): string {
    if (!historyName) {
        return undefined
    } else {
        return PREFIX + route.path + '_' + historyName
    }
}

const _default = defineComponent({
    name: "SwitchFilterItem",
    props: {
        defaultValue: {
            type: Boolean,
            default: false
        },
        /**
         * Whether to save the value in the localstorage with {@param historyName}
         */
        historyName: {
            type: String,
            required: false
        },
        label: String
    },
    emits: ["change"],
    setup(props, ctx) {
        const modelValue: Ref<boolean> = ref(props.defaultValue)
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