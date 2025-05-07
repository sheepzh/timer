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
import { defineComponent, type StyleValue, toRaw, toRef } from "vue"

const clearShortcut = (): ElementDatePickerShortcut => ({
    text: t(msg => msg.button.clear),
    value: [new Date(0), new Date(0)],
})

type Props = {
    modelValue: [Date, Date] | undefined
    disabledDate?: (date: Date) => boolean
    startPlaceholder?: string
    endPlaceholder?: string
    shortcuts?: ElementDatePickerShortcut[]
    clearable?: boolean
    onChange: (val: [Date, Date] | undefined) => void
}

const DateRangeFilterItem = defineComponent<Props>(props => {
    const handleChange = (newVal: [Date, Date] | undefined) => {
        const [start, end] = newVal || []
        const isClearChosen = !start?.getTime?.() && !end?.getTime?.()
        if (isClearChosen) newVal = undefined
        props.onChange(newVal)
    }

    const clearable = toRef(props, "clearable", true)

    const shortcuts = () => {
        const { shortcuts: value } = props
        if (!value?.length || !clearable.value) return value
        return [...value, clearShortcut()]
    }

    return () => (
        <span class="filter-item">
            <ElDatePicker
                modelValue={props.modelValue}
                format={dateFormat()}
                type="daterange"
                rangeSeparator="-"
                disabledDate={props.disabledDate}
                shortcuts={shortcuts()}
                onUpdate:modelValue={newVal => handleChange(toRaw(newVal))}
                startPlaceholder={props.startPlaceholder}
                endPlaceholder={props.endPlaceholder}
                clearable={clearable.value}
                style={{
                    "--el-date-editor-width": "240px",
                } satisfies StyleValue}
                v-slots={getDatePickerIconSlots()}
            />
        </span>
    )
}, {
    props: ["clearable", "disabledDate", "endPlaceholder", "modelValue", "onChange", "shortcuts", "startPlaceholder"],
})

export default DateRangeFilterItem