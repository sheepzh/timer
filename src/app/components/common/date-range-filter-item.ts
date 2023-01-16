/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElDatePicker } from "element-plus"
import { defineComponent, h, PropType, ref, Ref } from "vue"
import { ElementDatePickerShortcut } from "@src/element-ui/date"
import { t } from "@app/locale"

const _default = defineComponent({
    name: "DateRangeFilterItem",
    props: {
        defaultRange: Array as PropType<Date[]>,
        disabledDate: Function,
        startPlaceholder: String,
        endPlaceholder: String,
        shortcuts: Array as PropType<Array<ElementDatePickerShortcut>>,
        clearable: {
            type: Boolean,
            default: true
        }
    },
    emits: {
        change: (_value: Date[]) => true
    },
    setup(props, ctx) {
        // @ts-ignore
        const dateRange: Ref<Date[]> = ref(props.defaultRange || [undefined, undefined])
        const dateFormat = t(msg => msg.calendar.dateFormat, {
            y: 'YYYY',
            m: 'MM',
            d: 'DD'
        })
        // @ts-ignore
        return () => h('span', { class: 'filter-item' }, h(ElDatePicker,
            {
                modelValue: dateRange.value,
                format: dateFormat,
                type: 'daterange',
                rangeSeparator: '-',
                disabledDate: props.disabledDate,
                shortcuts: props.shortcuts,
                'onUpdate:modelValue': (newVal: Array<Date>) => ctx.emit("change", dateRange.value = newVal),
                startPlaceholder: props.startPlaceholder,
                endPlaceholder: props.endPlaceholder,
                clearable: props.clearable
            }
        ))
    }
})

export default _default