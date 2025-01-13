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

type Value = Pick<timer.limit.Item, 'time' | 'visitTime' | 'weekly' | 'periods'>

const MAX_HOUR_WEEKLY = 7 * 24

const _default = defineComponent({
    props: {
        time: Number,
        visitTime: Number,
        weekly: Number,
        maxVisit: Number,
        weeklyMaxVisit: Number,
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
        const [maxVisit, setMaxVisit] = useShadow(() => props.maxVisit ?? 0)
        const [weeklyMaxVisit, setWeeklyMaxVisit] = useShadow(() => props.weeklyMaxVisit ?? 0)
        // Periods
        const [periods, setPeriods] = useShadow(() => props.periods, [])

        watch([time, visitTime, periods, weekly], () => {
            const val: Value = {
                time: time.value,
                visitTime: visitTime.value,
                weekly: weekly.value,
                periods: periods.value,
            }
            ctx.emit("change", val)
        })

        const validate = () => {
            if (!time.value && !visitTime.value && !periods.value?.length && !weekly.value) {
                ElMessage.error(t(msg => msg.limit.message.noRule))
                return false
            }
            return true
        }
        ctx.expose({ validate } satisfies StepFromInstance)

        return () => (
            <ElForm labelWidth={150} labelPosition="left">
                <Flex gap={40}>
                    <Flex flex={1}>
                        <ElFormItem label={t(msg => msg.limit.item.time)}>
                            <TimeInput modelValue={time.value} onChange={setTime} />
                        </ElFormItem>
                    </Flex>
                    <Flex flex={1}>
                        <ElFormItem label={t(msg => msg.limit.item.maxVisit)}>
                            <ElInputNumber
                                min={0}
                                step={10}
                                modelValue={maxVisit.value}
                                onChange={setMaxVisit}
                            />
                        </ElFormItem>
                    </Flex>
                </Flex>
                <Flex gap={40}>
                    <Flex flex={1}>
                        <ElFormItem label={t(msg => msg.limit.item.weekly)}>
                            <TimeInput modelValue={weekly.value} onChange={setWeekly} />
                        </ElFormItem>
                    </Flex>
                    <Flex flex={1}>
                        <ElFormItem label={t(msg => msg.limit.item.weeklyMaxVisit)}>
                            <ElInputNumber
                                min={0}
                                step={10}
                                modelValue={weeklyMaxVisit.value}
                                onChange={setWeeklyMaxVisit}
                            />
                        </ElFormItem>
                    </Flex>
                </Flex>
                <ElFormItem label={t(msg => msg.limit.item.visitTime)}>
                    <TimeInput modelValue={visitTime.value} onChange={setVisitTime} />
                </ElFormItem>
                <ElFormItem label={t(msg => msg.limit.item.period)}>
                    <PeriodInput modelValue={periods.value} onChange={setPeriods} />
                </ElFormItem>
            </ElForm>
        )
    }
})

export default _default