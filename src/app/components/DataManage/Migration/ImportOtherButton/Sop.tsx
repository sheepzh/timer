/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { ElStep, ElSteps } from "element-plus"
import { Ref, defineComponent, nextTick, ref } from "vue"
import Step1 from "./Step1"
import Step2 from "./Step2"

const _default = defineComponent({
    emits: {
        cancel: () => true,
        import: () => true,
    },
    setup(_, ctx) {
        const step: Ref<0 | 1> = ref(0)
        const data: Ref<timer.imported.Data> = ref()
        return () => (
            <div class="sop-dialog-container">
                <div class="step-container">
                    <ElSteps space={200} finishStatus="success" active={step.value}>
                        <ElStep title={t(msg => msg.dataManage.importOther.step1)} />
                        <ElStep title={t(msg => msg.dataManage.importOther.step2)} />
                    </ElSteps>
                </div>
                <div class="operation-container">
                    {step.value === 0
                        ? <Step1
                            onCancel={() => ctx.emit("cancel")}
                            onNext={newData => {
                                data.value = newData
                                step.value = 1
                            }}
                        />
                        : <Step2
                            data={data.value}
                            onBack={() => step.value = 0}
                            onImport={() => {
                                step.value = 0
                                nextTick(() => ctx.emit("import"))
                            }}
                        />
                    }
                </div>
            </div>
        )
    }
})

export default _default