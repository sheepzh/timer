/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElDialog, ElMessage } from "element-plus"
import { defineComponent, h, ref, Ref } from "vue"
import Form, { FormData } from "./form"
import Footer from "./footer"
import LimitDatabase from "@db/limit-database"
import { t } from "@app/locale"

const db = new LimitDatabase(chrome.storage.local)

const noUrlError = t(msg => msg.limit.message.noUrl)
const noTimeError = t(msg => msg.limit.message.noTime)
const _default = defineComponent({
    emits: ['save'],
    setup: (_, ctx) => {
        const visible: Ref<boolean> = ref(false)
        const form: Ref = ref()

        ctx.expose({
            show: () => visible.value = true,
            hide: () => visible.value = false
        })

        return () => h(ElDialog, {
            title: t(msg => msg.limit.addTitle),
            modelValue: visible.value,
            closeOnClickModal: false,
            onClose: () => visible.value = false
        }, {
            default: () => h(Form, { ref: form }),
            footer: () => h(Footer, {
                async onSave() {
                    const { url, timeLimit }: FormData = form.value?.getData?.()
                    if (!url) {
                        ElMessage.warning(noUrlError)
                        return
                    }
                    if (!timeLimit) {
                        ElMessage.warning(noTimeError)
                        return
                    }
                    const toInsert: timer.limit.Rule = { cond: url, time: timeLimit, enabled: true, allowDelay: true }
                    await db.save(toInsert)
                    visible.value = false
                    ElMessage.success(t(msg => msg.limit.message.saved))
                    form.value?.clean?.()
                    ctx.emit("save", toInsert)
                }
            })
        })
    }
})

export default _default