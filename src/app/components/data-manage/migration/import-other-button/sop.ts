import { t } from "@app/locale"
import { ElStep, ElSteps } from "element-plus"
import { Ref, defineComponent, h, nextTick, ref } from "vue"
import Step1 from "./step1"
import Step2 from "./step2"
import { ImportedData } from "./processor"

const _default = defineComponent({
    emits: {
        cancel: () => true,
        import: () => true,
    },
    setup(_, ctx) {
        const step: Ref<0 | 1> = ref(0)
        const data: Ref<ImportedData> = ref()
        return () => h('div', { class: 'sop-dialog-container' }, [
            h('div', { class: 'step-container' }, h(ElSteps, {
                space: 200,
                finishStatus: 'success',
                active: step.value,
            }, () => [
                h(ElStep, { title: t(msg => msg.dataManage.importOther.step1) }),
                h(ElStep, { title: t(msg => msg.dataManage.importOther.step2) }),
            ])),
            h('div', { class: 'operation-container' }, step.value === 0
                ? h(Step1, {
                    onCancel: () => ctx.emit('cancel'),
                    onNext: newData => {
                        data.value = newData
                        step.value = 1
                    },
                })
                : h(Step2, {
                    data: data.value,
                    onBack: () => step.value = 0,
                    onImport: () => {
                        step.value = 0
                        nextTick(() => ctx.emit('import'))
                    },
                })
            ),
        ])
    }
})

export default _default