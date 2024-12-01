/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { EL_DATE_FORMAT } from "@i18n/element"
import { ElementDatePickerShortcut } from "@src/element-ui/date"
import { getDatePickerIconSlots } from "@src/element-ui/rtl"
import { ElDatePicker } from "element-plus"
import { defineComponent, PropType, ref, Ref } from "vue"

const clearShortcut = (): ElementDatePickerShortcut => ({
    text: t(msg => msg.button.clear),
    value: [new Date(0), new Date(0)],
})

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
        const handleChange = (newVal: [Date, Date]) => {
            const [start, end] = newVal || []
            const isClearChosen = start?.getTime?.() === 0 && end?.getTime?.() === 0
            if (isClearChosen) newVal = null
            ctx.emit("change", dateRange.value = newVal)
        }
        const shortcuts = () => {
            const { shortcuts: value, clearable } = props
            if (!value?.length || !clearable) return value
            return [...value, clearShortcut()]
        }

        const dateRange: Ref<[Date, Date]> = ref(props.defaultRange || [undefined, undefined])
        return () => <span class="filter-item">
            <ElDatePicker
                modelValue={dateRange.value}
                format={EL_DATE_FORMAT}
                type="daterange"
                rangeSeparator="-"
                disabledDate={props.disabledDate}
                shortcuts={shortcuts()}
                onUpdate:modelValue={(newVal: [Date, Date]) => handleChange(newVal)}
                startPlaceholder={props.startPlaceholder}
                endPlaceholder={props.endPlaceholder}
                clearable={props.clearable}
                v-slots={getDatePickerIconSlots()}
            />
        </span>
    }
})

export default _default