
import type { PropType, Ref } from "vue"
import type { RouteLocation } from "vue-router"

import { watch } from "vue"
import { ElOption, ElSelect } from "element-plus"
import { defineComponent, h, ref, nextTick } from "vue"
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
    name: "SelectFilterItem",
    props: {
        defaultValue: String,
        /**
         * Whether to save the value in the localstorage with {@param historyName}
         */
        historyName: {
            type: String,
            required: false
        },
        options: Object as PropType<Record<string | number, string>>
    },
    emits: ['select'],
    setup(props, ctx) {
        const modelValue: Ref<string> = ref(props.defaultValue)
        const historyWrapper = new FilterItemHistoryWrapper(useRoute().path, props.historyName)
        // Initiliaze value
        historyWrapper.ifPresent(
            historyVal => nextTick(() => ctx.emit('select', (modelValue.value = historyVal)))
        )

        watch(modelValue, () => {
            ctx.emit('select', modelValue.value)
            historyWrapper.setValue(modelValue.value)
        })
        return () => h(ElSelect, {
            class: 'filter-item',
            modelValue: modelValue.value,
            clearable: false,
            onChange(newVal) {
                modelValue.value = newVal
            }
        }, () => Object.entries(props.options || {}).map(([value, label]) => h(ElOption, { label, value })))
    }
})

export default _default