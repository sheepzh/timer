import { t } from "@app/locale"
import { ElStep, ElSteps } from "element-plus"
import { Ref, defineComponent, nextTick, ref } from "vue"
import Step1, { type StatResult } from "./Step1"
import Step2 from "./Step2"

const _default = defineComponent({
    emits: {
        cancel: () => true,
        clear: () => true,
    },
    setup(_, ctx) {
        const step: Ref<0 | 1> = ref(0)
        const data: Ref<StatResult> = ref()

        return () => (
            <div class="sop-dialog-container">
                <div class="step-container">
                    <ElSteps space={200} finishStatus="success" active={step.value}>
                        <ElStep title={t(msg => msg.option.backup.clientTable.selectTip)} />
                        <ElStep title={t(msg => msg.option.backup.download.step2)} />
                    </ElSteps>
                </div>
                <div class="operation-container" >
                    {step.value === 0
                        ? <Step1
                            onCancel={() => ctx.emit("cancel")}
                            onNext={val => {
                                data.value = val
                                step.value = 1
                            }}
                        />
                        : <Step2
                            data={data.value}
                            onBack={() => step.value = 0}
                            onClear={() => {
                                step.value = 0
                                nextTick(() => ctx.emit("clear"))
                            }} />
                    }
                </div>
            </div>
        )
    }
})

export default _default