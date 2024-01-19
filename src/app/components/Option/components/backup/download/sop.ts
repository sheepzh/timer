/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { ElStep, ElSteps } from "element-plus"
import { Ref, defineComponent, h, nextTick, ref } from "vue"
import Step1 from "./step1"
import Step2 from "./step2"

const _default = defineComponent({
    emits: {
        cancel: () => true,
        download: () => true,
    },
    setup(_, ctx) {
        const step: Ref<0 | 1> = ref(0)
        const data: Ref<timer.imported.Data> = ref()
        const client: Ref<timer.backup.Client> = ref()
        return () => h('div', { class: 'sop-dialog-container' }, [
            h('div', { class: 'step-container' }, h(ElSteps, {
                space: 200,
                finishStatus: 'success',
                active: step.value,
            }, () => [
                h(ElStep, { title: t(msg => msg.option.backup.clientTable.selectTip) }),
                h(ElStep, { title: t(msg => msg.option.backup.download.step2) }),
            ])),
            h('div', { class: 'operation-container' }, step.value === 0
                ? h(Step1, {
                    onCancel: () => ctx.emit('cancel'),
                    onNext: (newData, clientVal) => {
                        data.value = newData
                        client.value = clientVal
                        step.value = 1
                    },
                })
                : h(Step2, {
                    data: data.value,
                    clientName: client.value?.name,
                    onBack: () => step.value = 0,
                    onDownload: () => {
                        step.value = 0
                        nextTick(() => ctx.emit('download'))
                    },
                })
            ),
        ])
    }
})

export default _default