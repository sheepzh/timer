/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElDialog, ElMessage } from "element-plus"
import { computed, defineComponent, nextTick, ref, toRaw } from "vue"
import Sop, { SopInstance } from "./Sop"
import limitService from "@service/limit-service"
import { t } from "@app/locale"

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
        const visible = ref(false)
        const sop = ref<SopInstance>()
        const mode = ref<Mode>()
        const title = computed(() => mode.value === "create" ? t(msg => msg.button.create) : t(msg => msg.button.modify))
        // Cache
        let modifyingItem: timer.limit.Rule = undefined

        const handleSave = async (rule: timer.limit.Rule) => {
            const { cond, enabled, name, time, visitTime, periods } = rule
            const toSave: timer.limit.Rule = {
                ...modifyingItem || {},
                cond, enabled, name, time, visitTime, periods, allowDelay: false,
            }
            if (mode.value === 'modify') {
                await limitService.update(toSave)
            } else {
                await limitService.create(toSave)
            }
            close()
            ElMessage.success(t(msg => msg.operation.successMsg))
            sop.value?.reset?.()
            ctx.emit("save", toSave)
        }

        const close = () => visible.value = false

        const instance: ModifyInstance = {
            create() {
                visible.value = true
                mode.value = 'create'
                modifyingItem = undefined
                nextTick(() => sop.value?.reset())
            },
            modify(row: timer.limit.Item) {
                visible.value = true
                mode.value = 'modify'
                modifyingItem = { ...row }
                nextTick(() => sop.value?.reset?.(toRaw(row)))
            },
        }

        ctx.expose(instance)

        return () => (
            <ElDialog
                title={title.value}
                modelValue={visible.value}
                closeOnClickModal={false}
                onClose={close}
            >
                <Sop ref={sop} onSave={handleSave} onCancel={close} />
            </ElDialog>
        )
    }
})

export default _default