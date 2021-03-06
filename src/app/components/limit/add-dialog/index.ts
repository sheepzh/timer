import { ElDialog, ElMessage } from "element-plus"
import { defineComponent, h, ref, Ref, SetupContext, useContext } from "vue"
import { t } from "../../../locale"
import Form, { FormData } from './form'
import Footer from './footer'
import LimitDatabase from "../../../../database/limit-database"
import { TimeLimit } from "../../../../entity/dao/time-limit"

const db = new LimitDatabase(chrome.storage.local)

const dialogVisibleRef: Ref<boolean> = ref(false)
const methods = {
    show: () => dialogVisibleRef.value = true,
    hide: () => dialogVisibleRef.value = false
}

const formRef: Ref = ref()

const handleSave = async (ctx: { $emit: (arg0: string) => void }) => {
    const { url, timeLimit }: FormData = formRef.value.getData()
    if (!url) {
        ElMessage.warning(t(msg => msg.limit.message.noUrl))
        return
    }
    if (!timeLimit) {
        ElMessage.warning(t(msg => msg.limit.message.noTime))
        return
    }
    const toInsert: TimeLimit = { cond: url, time: timeLimit, enabled: true }
    await db.save(toInsert)
    dialogVisibleRef.value = false
    ElMessage.success(t(msg => msg.limit.message.saved))
    formRef.value.clean()
    ctx.$emit('saved')
}

const render = (ctx: any) => h(ElDialog,
    {
        title: t(msg => msg.limit.addTitle),
        modelValue: dialogVisibleRef.value,
        closeOnClickModal: false,
        onClose: () => dialogVisibleRef.value = false
    },
    {
        default: () => h(Form, { ref: formRef }),
        footer: () => h(Footer, { onSave: () => handleSave(ctx) })
    }
)

const _default = defineComponent({
    emits: ['saved'],
    setup: (_, context: SetupContext) => {
        context.expose(methods)
    },
    render
})

export default _default