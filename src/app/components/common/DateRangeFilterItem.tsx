/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElDatePicker } from "element-plus"
import { defineComponent, PropType, ref, Ref } from "vue"
import { ElementDatePickerShortcut } from "@src/element-ui/date"
import { t } from "@app/locale"

const _default = defineComponent({
    props: {
        defaultRange: Object as PropType<[Date, Date]>,
        disabledDate: Function,
        startPlaceholder: String,
        endPlaceholder: String,
        shortcuts: Array as PropType<ElementDatePickerShortcut[]>,
        clearable: {
            type: Boolean,
            default: true
        }
    },
    emits: {
        change: (_value: [Date, Date]) => true
    },
    setup(props, ctx) {
        const dateRange: Ref<[Date, Date]> = ref(props.defaultRange || [undefined, undefined])
        return () => <span class="filter-item">
            <ElDatePicker
                modelValue={dateRange.value}
                format={t(msg => msg.calendar.dateFormat, { y: 'YYYY', m: 'MM', d: 'DD' })}
                type="daterange"
                rangeSeparator="-"
                disabledDate={props.disabledDate}
                shortcuts={props.shortcuts}
                onUpdate:modelValue={(newVal: [Date, Date]) => ctx.emit("change", dateRange.value = newVal)}
                startPlaceholder={props.startPlaceholder}
                endPlaceholder={props.endPlaceholder}
                clearable={props.clearable}
            />
        </span>
    }
})

export default _default