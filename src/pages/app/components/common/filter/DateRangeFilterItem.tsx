/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { dateFormat } from "@i18n/element"
import { type ElementDatePickerShortcut } from "@pages/element-ui/date"
import { getDatePickerIconSlots } from "@pages/element-ui/rtl"
import { ElDatePicker } from "element-plus"
import { defineComponent, type PropType, ref, StyleValue } from "vue"

const clearShortcut = (): ElementDatePickerShortcut => ({
    text: t(msg => msg.button.clear),
    value: [new Date(0), new Date(0)],
})

const _default = defineComponent({
    props: {
        defaultRange: {
            type: Object as PropType<[Date, Date] | undefined>,
            required: true,
        },
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
        change: (_value: [Date, Date] | undefined) => true
    },
    setup(props, ctx) {
        const handleChange = (newVal: [Date, Date] | undefined) => {
            const [start, end] = newVal || []
            const isClearChosen = start?.getTime?.() === 0 && end?.getTime?.() === 0
            if (isClearChosen) newVal = undefined
            ctx.emit("change", dateRange.value = newVal)
        }
        const shortcuts = () => {
            const { shortcuts: value, clearable } = props
            if (!value?.length || !clearable) return value
            return [...value, clearShortcut()]
        }

        const dateRange = ref(props.defaultRange)

        return () => <span class="filter-item">
            <ElDatePicker
                modelValue={dateRange.value}
                format={dateFormat()}
                type="daterange"
                rangeSeparator="-"
                disabledDate={props.disabledDate}
                shortcuts={shortcuts()}
                onUpdate:modelValue={(newVal: [Date, Date]) => handleChange(newVal)}
                startPlaceholder={props.startPlaceholder}
                endPlaceholder={props.endPlaceholder}
                clearable={props.clearable}
                style={{
                    "--el-date-editor-width": "240px",
                } satisfies StyleValue}
                v-slots={getDatePickerIconSlots()}
            />
        </span>
    }
})

export default _default