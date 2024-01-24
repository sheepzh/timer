/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { ElStep, ElSteps } from "element-plus"
import { Ref, defineComponent, nextTick, reactive, ref, toRaw } from "vue"
import Step1 from "./Step1"
import Step2, { RuleFormData } from "./Step2"

type Step = 0 | 1

export type SopInstance = {
    clean: () => void
    modify: (rule: timer.limit.Rule) => void
}

const createInitial = (): timer.limit.Rule => ({
    time: 3600,
    cond: "*://",
    visitTime: undefined,
    periods: undefined,
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
        const step: Ref<Step> = ref(0)
        const data = reactive(createInitial())
        const condDisabled: Ref<boolean> = ref(false)

        const instance: SopInstance = {
            clean: () => {
                const initial = createInitial()
                Object.entries(initial).forEach(([k, v]) => data[k] = v)
                condDisabled.value = false
                step.value = 0
            },
            modify: rule => {
                Object.entries(rule).forEach(([k, v]) => data[k] = v)
                condDisabled.value = true
                step.value = 1
            }
        }

        ctx.expose(instance)

        const restoreData = (f: RuleFormData) => {
            const { time, periods, visitTime } = f || {}
            data.time = time ? time : undefined
            data.periods = periods?.length ? periods : undefined
            data.visitTime = visitTime ? visitTime : undefined
        }

        return () => (
            <div class="sop-dialog-container">
                <div class="step-container">
                    <ElSteps space={200} finishStatus="success" active={step.value}>
                        <ElStep title={t(msg => msg.limit.step1)} />
                        <ElStep title={t(msg => msg.limit.step2)} />
                    </ElSteps>
                </div>
                <div class="operation-container">
                    {step.value === 0
                        ? <Step1
                            defaultValue={data.cond}
                            disabled={condDisabled.value}
                            onCancel={() => ctx.emit("cancel")}
                            onNext={cond => {
                                step.value = 1
                                !condDisabled.value && (data.cond = cond)
                            }}
                        />
                        : <Step2
                            rule={data}
                            onBack={f => {
                                restoreData(f)
                                step.value = 0
                            }}
                            onSave={f => {
                                restoreData(f)
                                nextTick(() => ctx.emit('save', toRaw(data)))
                            }}
                        />
                    }
                </div>
            </div>
        )
    }
})

export default _default