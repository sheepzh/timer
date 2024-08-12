/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { ElStep, ElSteps } from "element-plus"
import { Ref, computed, defineComponent, reactive, ref, toRaw } from "vue"
import { StepFromInstance } from "./common"
import Step1 from "./Step1"
import Step2 from "./Step2"
import Step3 from "./Step3"
import { useState } from "@hooks"
import Footer from "./Footer"
import { range } from "@util/array"

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
        const [step, _setStep, resetStep] = useState<Step>(0)
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
            resetStep()
        }

        ctx.expose({ reset } satisfies SopInstance)

        const handleBack = () => first.value ? ctx.emit("cancel") : step.value--
        const handleNext = () => {
            const stepInst = stepInstances[step.value]?.value
            if (!stepInst?.validate?.()) return
            last.value ? ctx.emit("save", toRaw(data)) : step.value++
        }

        return () => (
            <div class="sop-dialog-container">
                <div class="step-container">
                    <ElSteps space={200} finishStatus="success" active={step.value}>
                        <ElStep title={t(msg => msg.limit.step.base)} />
                        <ElStep title={t(msg => msg.limit.step.url)} />
                        <ElStep title={t(msg => msg.limit.step.rule)} />
                    </ElSteps>
                </div>
                <div class="operation-container">
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
                        defaultValue={data.cond}
                        onChange={val => data.cond = val}
                    />
                    <Step3
                        v-show={step.value === 2}
                        ref={stepInstances[2]}
                        time={data.time}
                        weekly={data.weekly}
                        visitTime={data.visitTime}
                        periods={data.periods}
                        onChange={({ time, visitTime, periods, weekly }) => {
                            data.time = time
                            data.visitTime = visitTime
                            data.periods = periods
                            data.weekly = weekly
                        }}
                    />
                </div>
                <Footer
                    last={last.value}
                    first={first.value}
                    onBack={handleBack}
                    onNext={handleNext}
                />
            </div>
        )
    }
})

export default _default