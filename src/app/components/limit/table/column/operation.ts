/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Delete } from "@element-plus/icons-vue"
import { ElButton, ElMessageBox, ElTableColumn } from "element-plus"
import { defineComponent, h } from "vue"
import TimeLimitItem from "@entity/dto/time-limit-item"
import { t } from "@app/locale"

const label = t(msg => msg.limit.item.operation)
const deleteButtonText = t(msg => msg.limit.button.delete)
const _default = defineComponent({
    name: "LimitOperationColumn",
    emits: ["rowDelete"],
    setup(_props, ctx) {
        return () => h(ElTableColumn, {
            prop: 'operations',
            label,
            minWidth: 80,
            align: 'center',
        }, {
            default: ({ row }: { row: TimeLimitItem }) => [
                h(ElButton, {
                    type: 'danger',
                    size: 'mini',
                    icon: Delete,
                    onClick() {
                        const { cond } = row
                        const message = t(msg => msg.limit.message.deleteConfirm, { cond })
                        ElMessageBox.confirm(message, { type: 'warning' })
                            .then(() => ctx.emit("rowDelete", row, cond))
                            .catch(() => { /** Do nothing */ })
                    }
                }, () => deleteButtonText)
            ]
        })
    }
})

export default _default