/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ComputedRef, Ref } from "vue"

import { ElCol, ElFormItem, ElInput, ElRow } from "element-plus"
import { defineComponent, h, computed, ref, watch } from "vue"
import { t } from "@app/locale"

const handleInput = (inputVal: string, ref: Ref<number>, maxVal: number) => {
    inputVal = inputVal?.trim?.()
    if (!inputVal) {
        ref.value = undefined
        return
    }
    let num = Number.parseInt(inputVal)
    if (isNaN(num)) return
    if (num < 0) num = 0
    if (num > maxVal) num = maxVal
    ref.value = num
}

const timeInput = (ref: Ref<number>, unit: string, maxVal: number) => h(ElCol, { span: 8 },
    () => h(ElInput, {
        modelValue: ref.value,
        clearable: true,
        onInput: (val: string) => handleInput(val, ref, maxVal),
        onClear: () => ref.value = undefined,
        placeholder: '0',
        class: 'limit-modify-time-limit-input'
    }, {
        append: () => unit
    })
)

function computeSecond2LimitInfo(time: number): [number, number, number] {
    time = time || 0
    const second = time % 60
    const totalMinutes = (time - second) / 60
    const minute = totalMinutes % 60
    const hour = (totalMinutes - minute) / 60
    return [hour, minute, second]
}

function computeLimitInfo2Second(hourRef: Ref<number>, minuteRef: Ref<number>, secondRef: Ref<number>): number {
    let time = 0
    time += (hourRef.value || 0) * 3600
    time += (minuteRef.value || 0) * 60
    time += (secondRef.value || 0)
    return time
}

const _default = defineComponent({
    name: "LimitTimeLimit",
    props: {
        modelValue: {
            type: Number
        }
    },
    emits: {
        change: (_val: number) => true
    },
    setup(props, ctx) {
        const [hour, minute, second] = computeSecond2LimitInfo(props.modelValue)
        const hourRef: Ref<number> = ref(hour)
        const minuteRef: Ref<number> = ref(minute)
        const secondRef: Ref<number> = ref(second)
        watch(() => props.modelValue, (newVal: number) => {
            const [hour, minute, second] = computeSecond2LimitInfo(newVal)
            hourRef.value = hour
            minuteRef.value = minute
            secondRef.value = second
        })
        const limitTime: ComputedRef<number> = computed(() => computeLimitInfo2Second(hourRef, minuteRef, secondRef))
        watch([hourRef, minuteRef, secondRef], () => ctx.emit('change', limitTime.value))
        return () => h(ElFormItem, {
            label: t(msg => msg.limit.item.time)
        }, () => h(ElRow, { gutter: 10 }, () => [
            timeInput(hourRef, 'H', 23),
            timeInput(minuteRef, 'M', 59),
            timeInput(secondRef, 'S', 59)
        ]))
    }
})

export default _default