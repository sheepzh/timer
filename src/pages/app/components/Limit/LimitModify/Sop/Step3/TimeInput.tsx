import { Clock } from "@element-plus/icons-vue"
import { useState } from "@hooks"
import Flex from "@pages/components/Flex"
import { getStyle } from "@pages/util/style"
import { range } from "@util/array"
import { useDebounceFn } from "@vueuse/core"
import { ElInput, ElPopover, ElScrollbar, ScrollbarInstance, useNamespace } from "element-plus"
import { computed, defineComponent, ref, watch } from "vue"

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
        const handleChange = (val?: number) => ctx.emit('change', val)

        const handleInput = (input: string) => {
            input = input?.trim?.()
            if (!input) return handleChange()
            let num = Number.parseInt(input)
            if (isNaN(num)) return
            num = Math.min(Math.max(0, num), props.max)
            handleChange(num)
        }

        return () => (
            <ElInput
                modelValue={props.modelValue}
                clearable
                onInput={handleInput}
                onClear={() => handleChange()}
                placeholder="0"
                v-slots={{ append: () => props.unit }}
            />
        )
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
            <Flex width="100%" gap={15} justify="space-between">
                <UnitInput modelValue={hour.value} onChange={setHour} unit="H" max={props.hourMax ?? 23} />
                <UnitInput modelValue={minute.value} onChange={setMinute} unit="M" max={59} />
                <UnitInput modelValue={second.value} onChange={setSecond} unit="S" max={59} />
            </Flex>
        )
    }
})

export default _default

const formatTimeVal = (val: number): string => {
    return val?.toString?.()?.padStart?.(2, '0') ?? 'NaN'
}

const TimeSpinner = defineComponent({
    props: {
        max: Number,
        modelValue: Number,
    },
    emits: {
        change: (_val: number) => true,
    },
    setup(props, ctx) {
        const ns = useNamespace('time')
        const scrollbar = ref<ScrollbarInstance>()
        const scrolling = ref(false)

        const debounceChangeValue = useDebounceFn((val: number) => {
            scrolling.value = false
            ctx.emit('change', val)
        }, 200)

        const bindScroll = (el: HTMLDivElement) => {
            if (!el) return
            el.addEventListener('scroll', () => {
                scrolling.value = true
                const value = Math.min(
                    Math.round(
                        (el.scrollTop - (scrollBarHeight() * 0.5 - 10) / typeItemHeight() + 3)
                        /
                        typeItemHeight()
                    ),
                    props.max - 1
                )
                debounceChangeValue(value)
            })
        }

        const scrollBarHeight = () => (scrollbar.value.$el as HTMLUListElement)!.offsetHeight

        const typeItemHeight = (): number => {
            const listItem = scrollbar.value?.$el.querySelector('li') as HTMLLinkElement
            if (listItem) {
                return Number.parseFloat(getStyle(listItem, 'height')) || 0
            }
            return 0
        }

        return () => (
            <ElScrollbar
                ref={scrollbar}
                class={ns.be('spinner', 'wrapper')}
                viewClass={ns.be('spinner', 'list')}
                noresize
                tag="ul"
                onVnodeMounted={v => {
                    const el = v.el as HTMLDivElement
                    bindScroll(el)
                }}
            >
                {range(props.max).map(idx => (
                    <li
                        onClick={() => ctx.emit('change', idx)}
                        class={[
                            ns.be('spinner', 'item'),
                            ns.is('active', idx === props.modelValue),
                        ]}
                    >
                        {idx.toString().padStart(2, '0')}
                    </li>
                ))}
            </ElScrollbar>
        )
    },
})

/**
 * Rewrite
 *
 * https://github.com/element-plus/element-plus/blob/dev/packages/components/time-picker/src/time-picker-com/panel-time-pick.vue
 */
export const TimeInput2 = defineComponent({
    props: {
        modelValue: Number,
        hourMax: Number,
    },
    emits: {
        change: (_val: number) => true,
    },
    setup(props, ctx) {
        const [hourVal, minuteVal, secondVal] = computeSecond2LimitInfo(props.modelValue)
        const [hour, setHour] = useState(hourVal)
        const [minute, setMinute] = useState(minuteVal)
        const [second, setSecond] = useState(secondVal)

        const inputText = computed(() => `${formatTimeVal(hour.value)} h ${formatTimeVal(minute.value)} m ${formatTimeVal(second.value)} s`)

        const ns = useNamespace('time')

        return () => (
            <ElPopover
                popperClass='el-picker__popper'
                trigger='click'
                v-slots={{
                    reference: () => (
                        <ElInput
                            class="el-date-editor el-date-editor--time"
                            prefixIcon={<Clock />}
                            modelValue={inputText.value}
                            inputStyle={{ cursor: 'pointer' }}
                        />
                    )
                }}>
                <Flex column class={ns.b('panel')}>
                    <Flex class={[ns.be('panel', 'content'), 'has-seconds']}>
                        <div class={[ns.b('spinner'), 'has-seconds']}>
                            <TimeSpinner max={props.hourMax ?? 24} modelValue={hour.value} onChange={setHour} />
                        </div>
                    </Flex>
                </Flex>

            </ElPopover>
        )
    },
})

