import { useShadow, useState } from "@hooks"
import { ElInput } from "element-plus"
import { computed, defineComponent, watch } from "vue"

const UnitInput = defineComponent({
    props: {
        modelValue: Number,
        unit: {
            type: String,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
    },
    emits: {
        change: (_val: number) => true
    },
    setup(props, ctx) {
        const [time, setTime] = useShadow(() => props.modelValue)
        watch(time, () => ctx.emit("change", time.value))

        const handleInput = (input: string) => {
            input = input?.trim?.()
            if (!input) return setTime(undefined)
            let num = Number.parseInt(input)
            if (isNaN(num)) return
            num = Math.min(Math.max(0, num), props.max)
            setTime(num)
        }

        return () => <ElInput
            modelValue={time.value}
            clearable
            onInput={handleInput}
            onClear={() => setTime(undefined)}
            placeholder="0"
            class="limit-modify-time-limit-input"
            v-slots={{
                append: () => props.unit,
            }}
        />
    }
})


function computeSecond2LimitInfo(time: number): [number, number, number] {
    time = time || 0
    const second = time % 60
    const totalMinutes = (time - second) / 60
    const minute = totalMinutes % 60
    const hour = (totalMinutes - minute) / 60
    return [hour, minute, second]
}

function computeLimitInfo2Second(hour: number, minute: number, second: number): number {
    let time = 0
    time += (hour ?? 0) * 3600
    time += (minute ?? 0) * 60
    time += (second ?? 0)
    return time
}

const _default = defineComponent({
    props: {
        modelValue: Number,
        hourMax: Number
    },
    emits: {
        change: (_val: number) => true
    },
    setup(props, ctx) {
        const [hourVal, minuteVal, secondVal] = computeSecond2LimitInfo(props.modelValue)
        const [hour, setHour] = useState(hourVal)
        const [minute, setMinute] = useState(minuteVal)
        const [second, setSecond] = useState(secondVal)
        watch(() => props.modelValue, newVal => {
            const [hour, minute, second] = computeSecond2LimitInfo(newVal)
            setHour(hour)
            setMinute(minute)
            setSecond(second)
        })
        const limitTime = computed(() => computeLimitInfo2Second(hour.value, minute.value, second.value))
        watch(limitTime, () => ctx.emit('change', limitTime.value))

        return () => (
            <div class="limit-time-input">
                <UnitInput modelValue={hour.value} onChange={setHour} unit="H" max={props.hourMax ?? 23} />
                <UnitInput modelValue={minute.value} onChange={setMinute} unit="M" max={59} />
                <UnitInput modelValue={second.value} onChange={setSecond} unit="S" max={59} />
            </div>
        )
    }
})

export default _default