/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElCol, ElFormItem, ElInput, ElRow } from "element-plus"
import { Ref, h } from "vue"
import { t } from "@app/locale"

type _Props = {
    hourRef: Ref<number>
    minuteRef: Ref<number>
    secondRef: Ref<number>
}

const handleInput = (val: string, ref: Ref<number>, maxVal: number) => {
    val = val.trim()
    if (!val) {
        ref.value = undefined
        return
    }
    let num = Number.parseInt(val)
    if (isNaN(num)) return
    if (num < 0) num = 0
    if (num > maxVal) num = maxVal
    ref.value = num
}

const timeInput = (valRef: Ref<number>, unit: string, maxVal: number) => h(ElCol, { span: 8 },
    () => h(ElInput,
        {
            modelValue: valRef.value === undefined ? '' : valRef.value.toString(),
            clearable: true,
            onInput: (val: string) => handleInput(val, valRef, maxVal),
            onClear: () => valRef.value = undefined,
            placeholder: '0'
        },
        {
            append: () => unit
        }
    )
)

const timeInputCols = (props: _Props) => h(ElRow, { gutter: 10 }, () => [
    timeInput(props.hourRef, 'H', 23),
    timeInput(props.minuteRef, 'M', 59),
    timeInput(props.secondRef, 'S', 59)
])

const timeFormItem = (props: _Props) => h(ElFormItem, { label: t(msg => msg.limit.item.time) }, () => timeInputCols(props))

export default timeFormItem