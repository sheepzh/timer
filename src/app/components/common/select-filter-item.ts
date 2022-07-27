
import { PropType, Ref, watch } from "vue"

import { ElOption, ElSelect } from "element-plus"
import { defineComponent, h, ref } from "vue"

const _default = defineComponent({
    name: "SelectFilterItem",
    props: {
        defaultValue: String,
        options: Object as PropType<Record<string | number, string>>
    },
    emits: ['select'],
    setup(props, ctx) {
        const modelValue: Ref<string> = ref(props.defaultValue)
        watch(modelValue, () => ctx.emit('select', modelValue.value))
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