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
import { useShadow } from "@hooks/useShadow"
import { StepFromInstance } from "../common"
import "./style.sass"

const _default = defineComponent({
    props: {
        time: Number,
        visitTime: Number,
        periods: Array as PropType<timer.limit.Period[]>,
    },
    emits: {
        change: (_time: number, _visitTime: number, _periods: [number, number][]) => true,
    },
    setup(props, ctx) {
        const [time, setTime] = useShadow(() => props.time)
        const [visitTime, setVisitTime] = useShadow(() => props.visitTime)
        const [periods, setPeriods] = useShadow(() => props.periods, [])

        watch([time, visitTime, periods], () => ctx.emit("change", time.value, visitTime.value, periods.value))

        const validate = () => {
            if (!time.value && !visitTime.value && !periods.value?.length) {
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