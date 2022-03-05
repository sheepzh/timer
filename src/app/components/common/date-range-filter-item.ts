/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElDatePicker } from "element-plus"
import { defineComponent, h, PropType, ref, Ref } from "vue"
import { ElementDatePickerShortcut } from "@app/element-ui/date"

const _default = defineComponent({
    name: "DateRangeFilterItem",
    props: {
        disabledDate: Function,
        startPlaceholder: String,
        endPlaceholder: String,
        shortcuts: Array as PropType<Array<ElementDatePickerShortcut>>
    },
    emits: ["change"],
    setup(props, ctx) {
        const dateRange: Ref<Date[]> = ref([undefined, undefined])
        return () => h('span', { class: 'filter-item' }, h(ElDatePicker,
            {
                modelValue: dateRange.value,
                format: 'YYYY/MM/DD',
                type: 'daterange',
                rangeSeparator: '-',
                disabledDate: props.disabledDate,
                shortcuts: props.shortcuts,
                'onUpdate:modelValue': (newVal: Array<Date>) => ctx.emit("change", dateRange.value = newVal),
                startPlaceholder: props.startPlaceholder,
                endPlaceholder: props.endPlaceholder
            }
        ))
    }
})

export default _default