/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref, PropType, ComputedRef } from "vue"

import { ElOption, ElSelect, ElTimePicker } from "element-plus"
import { defineComponent, ref, watch, computed } from "vue"
import { t } from "@app/locale"

const ALL_MODES: timer.option.DarkMode[] = ["default", "on", "off", "timed"]

function computeSecondToDate(secondOfDate: number): Date {
    const now = new Date()
    const hour = Math.floor(secondOfDate / 3600)
    const minute = Math.floor((secondOfDate - hour * 3600) / 60)
    const second = Math.floor(secondOfDate % 60)
    now.setHours(hour)
    now.setMinutes(minute)
    now.setSeconds(second)
    now.setMilliseconds(0)
    return now
}

function computeDateToSecond(date: Date) {
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return hour * 3600 + minute * 60 + second
}

const _default = defineComponent({
    name: "DarkModeInput",
    props: {
        modelValue: String as PropType<timer.option.DarkMode>,
        startSecond: Number,
        endSecond: Number
    },
    emits: {
        change: (_darkMode: timer.option.DarkMode, [_startSecond, _endSecond]: [number, number]) => true
    },
    setup(props, ctx) {
        const darkMode: Ref<timer.option.DarkMode> = ref(props.modelValue)
        // @ts-ignore
        const start: Ref<Date> = ref(computeSecondToDate(props.startSecond))
        // @ts-ignore
        const end: Ref<Date> = ref(computeSecondToDate(props.endSecond))
        watch(() => props.modelValue, newVal => darkMode.value = newVal)
        watch(() => props.startSecond, newVal => start.value = computeSecondToDate(newVal))
        watch(() => props.endSecond, newVal => end.value = computeSecondToDate(newVal))
        const startSecond: ComputedRef<number> = computed(() => computeDateToSecond(start.value))
        const endSecond: ComputedRef<number> = computed(() => computeDateToSecond(end.value))

        const handleChange = () => ctx.emit("change", darkMode.value, [startSecond.value, endSecond.value])

        return () => <>
            <ElSelect
                modelValue={darkMode.value}
                size="small"
                style={{ width: "120px" }}
                onChange={val => {
                    darkMode.value = val as timer.option.DarkMode
                    handleChange()
                }}
            >
                {
                    ALL_MODES.map(value => <ElOption value={value} label={t(msg => msg.option.appearance.darkMode.options[value])} />)
                }
            </ElSelect>
            {darkMode.value === "timed" && <>
                <ElTimePicker
                    modelValue={start.value}
                    size="small"
                    style={{ marginLeft: "10px" }}
                    onUpdate:modelValue={val => {
                        start.value = val
                        handleChange()
                    }}
                    clearable={false}
                />
                <a>-</a>
                <ElTimePicker
                    modelValue={end.value}
                    size="small"
                    onUpdate:modelValue={val => {
                        end.value = val
                        handleChange()
                    }}
                    clearable={false}
                />
            </>}
        </>
    }
})

export default _default