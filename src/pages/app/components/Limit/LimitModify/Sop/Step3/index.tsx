/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { ElForm, ElFormItem, ElMessage } from "element-plus"
import { PropType, defineComponent, watch } from "vue"
import TimeInput from "./TimeInput"
import PeriodInput from "./PeriodInput"
import { useShadow } from "@hooks"
import { StepFromInstance } from "../common"
import "./style.sass"

type Value = Pick<timer.limit.Item, 'time' | 'visitTime' | 'weekly' | 'periods'>

const MAX_HOUR_WEEKLY = 7 * 24 - 1

const _default = defineComponent({
    props: {
        time: Number,
        visitTime: Number,
        weekly: Number,
        periods: Array as PropType<timer.limit.Period[]>,
    },
    emits: {
        change: (_val: Value) => true,
    },
    setup(props, ctx) {
        const [time, setTime] = useShadow(() => props.time)
        const [weekly, setWeekly] = useShadow(() => props.weekly)
        const [visitTime, setVisitTime] = useShadow(() => props.visitTime)
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

        return () => <div class="limit-step3">
            <ElForm labelWidth={180} labelPosition="left">
                <ElFormItem label={t(msg => msg.limit.item.time)}>
                    <TimeInput modelValue={time.value} onChange={setTime} />
                </ElFormItem>
                <ElFormItem label={t(msg => msg.limit.item.weekly)}>
                    <TimeInput
                        modelValue={weekly.value}
                        onChange={setWeekly}
                        hourMax={MAX_HOUR_WEEKLY}
                    />
                </ElFormItem>
                <ElFormItem label={t(msg => msg.limit.item.visitTime)}>
                    <TimeInput modelValue={visitTime.value} onChange={setVisitTime} />
                </ElFormItem>
                <ElFormItem label={t(msg => msg.limit.item.period)}>
                    <PeriodInput modelValue={periods.value} onChange={setPeriods} />
                </ElFormItem>
            </ElForm>
        </div>
    }
})

export default _default