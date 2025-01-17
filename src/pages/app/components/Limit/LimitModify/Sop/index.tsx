/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import DialogSop from "@app/components/common/DialogSop"
import { t } from "@app/locale"
import { useState } from "@hooks"
import { range } from "@util/array"
import { ElStep, ElSteps } from "element-plus"
import { type Ref, computed, defineComponent, reactive, ref, toRaw } from "vue"
import { StepFromInstance } from "./common"
import Step1 from "./Step1"
import Step2 from "./Step2"
import Step3 from "./Step3"

type Step = 0 | 1 | 2

export type SopInstance = {
    /**
     * Reset with rule or initial value
     */
    reset: (rule?: timer.limit.Rule) => void
}

const createInitial = (): Required<Omit<timer.limit.Rule, 'id' | 'allowDelay'>> => ({
    name: null,
    time: 3600,
    weekly: null,
    cond: [],
    visitTime: null,
    periods: null,
    enabled: true,
    weekdays: range(7),
    count: null,
    weeklyCount: null,
})

const _default = defineComponent({
    props: {
        condDisabled: Boolean,
    },
    emits: {
        cancel: () => true,
        save: (_rule: timer.limit.Rule) => true,
    },
    setup(_, ctx) {
        const [step, setStep] = useState<Step>(0)
        const last = computed(() => step.value === 2)
        const first = computed(() => step.value === 0)
        const data = reactive(createInitial())
        const stepInstances: { [step in Step]: Ref<StepFromInstance> } = {
            0: ref(),
            1: ref(),
            2: ref(),
        }

        const reset = (rule?: timer.limit.Rule) => {
            Object.entries(rule || createInitial()).forEach(([k, v]) => data[k] = v)
            // Compatible with old items
            if (!data.weekdays?.length) data.weekdays = range(7)
            setStep(0)
        }

        ctx.expose({ reset } satisfies SopInstance)

        const handleNext = () => {
            const stepInst = stepInstances[step.value]?.value
            if (!stepInst?.validate?.()) return
            last.value ? ctx.emit("save", toRaw(data)) : step.value++
        }

        const handleUrlsChange = (urls: string[]) => {
            let cond = data.cond
            if (cond) {
                cond.splice(0, data.cond?.length)
            } else {
                cond = data.cond = []
            }
            urls.forEach(v => data.cond.push(v))
        }

        return () => (
            <DialogSop
                last={last.value}
                first={first.value}
                onBack={() => step.value--}
                onCancel={() => ctx.emit('cancel')}
                onNext={handleNext}
                onFinish={handleNext}
                v-slots={{
                    steps: () => (
                        <ElSteps space={200} finishStatus="success" active={step.value} alignCenter>
                            <ElStep title={t(msg => msg.limit.step.base)} />
                            <ElStep title={t(msg => msg.limit.step.url)} />
                            <ElStep title={t(msg => msg.limit.step.rule)} />
                        </ElSteps>
                    ),
                    content: () => <>
                        <Step1
                            v-show={step.value === 0}
                            ref={stepInstances[0]}
                            defaultName={data.name}
                            defaultEnabled={data.enabled}
                            defaultWeekdays={data.weekdays}
                            onChange={(name, enabled, weekdays) => {
                                data.name = name
                                data.enabled = enabled
                                data.weekdays = weekdays
                            }}
                        />
                        <Step2
                            v-show={step.value === 1}
                            ref={stepInstances[1]}
                            modelValue={data.cond}
                            onChange={handleUrlsChange}
                        />
                        <Step3
                            v-show={step.value === 2}
                            ref={stepInstances[2]}
                            time={data.time}
                            weekly={data.weekly}
                            visitTime={data.visitTime}
                            count={data.count}
                            weeklyCount={data.weeklyCount}
                            periods={data.periods}
                            onChange={({ time, visitTime, periods, weekly, count, weeklyCount }) => {
                                data.time = time
                                data.visitTime = visitTime
                                data.periods = periods
                                data.weekly = weekly
                                data.count = count
                                data.weeklyCount = weeklyCount
                            }}
                        />
                    </>
                }}
            />
        )
    }
})

export default _default