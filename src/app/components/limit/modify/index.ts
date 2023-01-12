/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElDialog, ElMessage } from "element-plus"
import { defineComponent, h, nextTick, ref, Ref } from "vue"
import Form from "./form"
import Footer from "./footer"
import LimitDatabase from "@db/limit-database"
import { t } from "@app/locale"

const db = new LimitDatabase(chrome.storage.local)

const noUrlError = t(msg => msg.limit.message.noUrl)
const noTimeError = t(msg => msg.limit.message.noTime)
const _default = defineComponent({
    emits: {
        save: (_saved: timer.limit.Rule) => true
    },
    setup: (_, ctx) => {
        const visible: Ref<boolean> = ref(false)
        const form: Ref = ref()
        const mode: Ref<Mode> = ref()
        // Cache
        let modifyingItem: timer.limit.Item = undefined

        ctx.expose({
            create() {
                visible.value = true
                mode.value = 'create'
                modifyingItem = undefined
                nextTick(() => form.value?.clean?.())
            },
            modify(row: timer.limit.Item) {
                visible.value = true
                mode.value = 'modify'
                modifyingItem = { ...row }
                nextTick(() => form.value?.modify?.(row))
            },
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
                    const { condition, timeLimit }: FormInfo = form.value?.getData?.()
                    if (!condition) {
                        ElMessage.warning(noUrlError)
                        return
                    }
                    if (!timeLimit) {
                        ElMessage.warning(noTimeError)
                        return
                    }
                    const toSave: timer.limit.Rule = { cond: condition, time: timeLimit, enabled: true, allowDelay: true }
                    if (mode.value === 'modify' && modifyingItem) {
                        toSave.enabled = modifyingItem.enabled
                        toSave.allowDelay = modifyingItem.allowDelay
                    }
                    await db.save(toSave, mode.value === 'modify')
                    visible.value = false
                    ElMessage.success(t(msg => msg.limit.message.saved))
                    form.value?.clean?.()
                    ctx.emit("save", toSave)
                }
            })
        })
    }
})

export default _default