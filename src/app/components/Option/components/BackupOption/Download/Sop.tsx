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
        download: () => true,
    },
    setup(_, ctx) {
        const step: Ref<0 | 1> = ref(0)
        const data: Ref<timer.imported.Data> = ref()
        const client: Ref<timer.backup.Client> = ref()
        return () => (
            <div class="sop-dialog-container">
                <div class="step-container">
                    <ElSteps
                        space={200}
                        finishStatus="success"
                        active={step.value}
                    >
                        <ElStep title={t(msg => msg.option.backup.clientTable.selectTip)} />
                        <ElStep title={t(msg => msg.option.backup.download.step2)} />
                    </ElSteps>
                </div>
                <div class="operation-container">
                    {
                        step.value === 0
                            ? <Step1
                                onCancel={() => ctx.emit("cancel")}
                                onNext={(newData, clientVal) => {
                                    data.value = newData
                                    client.value = clientVal
                                    step.value = 1
                                }}
                            />
                            : <Step2
                                data={data.value}
                                clientName={client.value?.name}
                                onBack={() => step.value = 0}
                                onDownload={() => {
                                    step.value = 0
                                    nextTick(() => ctx.emit("download"))
                                }}
                            />
                    }
                </div>
            </div>
        )
    }
})

export default _default