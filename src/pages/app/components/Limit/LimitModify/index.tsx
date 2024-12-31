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
import { useSwitch } from "@hooks"

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
        const [visible, open, close] = useSwitch()
        const sop = ref<SopInstance>()
        const mode = ref<Mode>()
        const title = computed(() => mode.value === "create" ? t(msg => msg.button.create) : t(msg => msg.button.modify))
        // Cache
        let modifyingItem: timer.limit.Rule = undefined

        const handleSave = async (rule: timer.limit.Rule) => {
            const { cond, enabled, name, time, weekly, visitTime, periods, weekdays } = rule
            const toSave: timer.limit.Rule = {
                ...modifyingItem || {},
                cond, enabled, name, time, weekly, visitTime, weekdays,
                // Object to array
                periods: periods?.map(i => [i?.[0], i?.[1]]),
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

        const instance: ModifyInstance = {
            create() {
                open()
                mode.value = 'create'
                modifyingItem = undefined
                nextTick(() => sop.value?.reset())
            },
            modify(row: timer.limit.Item) {
                open()
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