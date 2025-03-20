/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { useShadow } from "@hooks"
import Flex from "@pages/components/Flex"
import { ElForm, ElFormItem, ElInputNumber, ElMessage } from "element-plus"
import { type PropType, defineComponent, watch } from "vue"
import { type StepFromInstance } from "../common"
import PeriodInput from "./PeriodInput"
import TimeInput from "./TimeInput"

type Value = Pick<timer.limit.Item, 'time' | 'visitTime' | 'weekly' | 'periods' | 'count' | 'weeklyCount'>

const MAX_HOUR_WEEKLY = 7 * 24

const _default = defineComponent({
    props: {
        time: Number,
        visitTime: Number,
        weekly: Number,
        count: Number,
        weeklyCount: Number,
        periods: Array as PropType<timer.limit.Period[]>,
    },
    emits: {
        change: (_val: Value) => true,
    },
    setup(props, ctx) {
        // Time
        const [time, setTime] = useShadow(() => props.time)
        const [weekly, setWeekly] = useShadow(() => props.weekly)
        const [visitTime, setVisitTime] = useShadow(() => props.visitTime)
        // Visit count
        const [count, setCount] = useShadow(() => props.count)
        const [weeklyCount, setWeeklyCount] = useShadow(() => props.weeklyCount)
        // Periods
        const [periods, setPeriods] = useShadow(() => props.periods, [])

        watch([time, visitTime, periods, weekly, count, weeklyCount], () => {
            const val: Value = {
                time: time.value,
                visitTime: visitTime.value,
                weekly: weekly.value,
                count: count.value,
                weeklyCount: weeklyCount.value,
                periods: periods.value,
            }
            ctx.emit("change", val)
        })

        const validate = () => {
            if (true
                && !time.value && !count.value
                && !weekly.value && !weeklyCount.value
                && !visitTime.value && !periods.value?.length
            ) {
                ElMessage.error(t(msg => msg.limit.message.noRule))
                return false
            }
            return true
        }
        ctx.expose({ validate } satisfies StepFromInstance)

        return () => (
            <Flex justify="center">
                <ElForm labelWidth={150} labelPosition="left">
                    <ElFormItem label={t(msg => msg.limit.item.daily)}>
                        <Flex gap={10}>
                            <TimeInput modelValue={time.value ?? 0} onChange={setTime} />
                            {t(msg => msg.limit.item.or)}
                            <ElInputNumber
                                min={0}
                                step={10}
                                modelValue={count.value}
                                onChange={setCount}
                                v-slots={{ suffix: () => t(msg => msg.limit.item.visits) }}
                            />
                        </Flex>
                    </ElFormItem>
                    <ElFormItem label={t(msg => msg.limit.item.weekly)}>
                        <Flex gap={10}>
                            <TimeInput modelValue={weekly.value ?? 0} onChange={setWeekly} hourMax={MAX_HOUR_WEEKLY} />
                            {t(msg => msg.limit.item.or)}
                            <ElInputNumber
                                min={0}
                                step={10}
                                modelValue={weeklyCount.value}
                                onChange={setWeeklyCount}
                                v-slots={{ suffix: () => t(msg => msg.limit.item.visits) }}
                            />
                        </Flex>
                    </ElFormItem>
                    <ElFormItem label={t(msg => msg.limit.item.visitTime)}>
                        <TimeInput modelValue={visitTime.value ?? 0} onChange={setVisitTime} />
                    </ElFormItem>
                    <ElFormItem label={t(msg => msg.limit.item.period)}>
                        <PeriodInput modelValue={periods.value} onChange={setPeriods} />
                    </ElFormItem>
                </ElForm>
            </Flex>
        )
    }
})

export default _default