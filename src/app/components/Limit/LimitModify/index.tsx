/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElDialog, ElMessage } from "element-plus"
import { computed, defineComponent, nextTick, ref, Ref } from "vue"
import Sop, { SopInstance } from "./Sop"
import limitService from "@service/limit-service"
import { t } from "@app/locale"
import "./style/el-input.sass"
import "./style/sop.sass"

export type ModifyInstance = {
    create(): void
    modify(row: timer.limit.Item): void
}

type Mode = "create" | "modify"

const _default = defineComponent({
    emits: {
        save: (_saved: timer.limit.Rule) => true
    },
    setup: (_, ctx) => {
        const visible: Ref<boolean> = ref(false)
        const sop: Ref<SopInstance> = ref()
        const mode: Ref<Mode> = ref()
        const title = computed(() => mode.value === "create" ? t(msg => msg.button.create) : t(msg => msg.button.modify))
        // Cache
        let modifyingItem: timer.limit.Rule = undefined

        const onSave = async (rule: timer.limit.Rule) => {
            const { cond, time, visitTime, periods } = rule
            const toSave: timer.limit.Rule = { cond, time, visitTime, periods, enabled: true, allowDelay: false }
            if (mode.value === 'modify' && modifyingItem) {
                toSave.enabled = modifyingItem.enabled
                toSave.allowDelay = modifyingItem.allowDelay
            }
            if (mode.value === "modify") {
                await limitService.update(toSave)
            } else {
                await limitService.create(toSave)
            }
            visible.value = false
            ElMessage.success(t(msg => msg.limit.message.saved))
            sop.value?.clean?.()
            ctx.emit("save", toSave)
        }

        const onClose = () => visible.value = false

        const instance: ModifyInstance = {
            create() {
                visible.value = true
                mode.value = 'create'
                modifyingItem = undefined
                nextTick(() => sop.value?.clean?.())
            },
            modify(row: timer.limit.Item) {
                visible.value = true
                mode.value = 'modify'
                modifyingItem = { ...row }
                nextTick(() => sop.value?.modify?.(row))
            },
        }

        ctx.expose(instance)

        return () => (
            <ElDialog
                title={title.value}
                modelValue={visible.value}
                closeOnClickModal={false}
                onClose={onClose}
            >
                <Sop ref={sop} onSave={onSave} onCancel={onClose} />
            </ElDialog>
        )
    }
})

export default _default