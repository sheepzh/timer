/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Delete, Edit } from "@element-plus/icons-vue"
import { ElButton, ElMessageBox, ElTableColumn } from "element-plus"
import { defineComponent, h } from "vue"
import { t } from "@app/locale"

const label = t(msg => msg.limit.item.operation)
const deleteButtonText = t(msg => msg.button.delete)
const modifyButtonText = t(msg => msg.button.modify)
const _default = defineComponent({
    name: "LimitOperationColumn",
    emits: {
        rowDelete: (_row: timer.limit.Item, _cond: string) => true,
        rowModify: (_row: timer.limit.Item) => true,
    },
    setup(_props, ctx) {
        return () => h(ElTableColumn, {
            prop: 'operations',
            label,
            minWidth: 200,
            align: 'center',
        }, {
            default: ({ row }: { row: timer.limit.Item }) => [
                h(ElButton, {
                    type: 'danger',
                    size: 'small',
                    icon: Delete,
                    onClick() {
                        const { cond } = row
                        const message = t(msg => msg.limit.message.deleteConfirm, { cond })
                        ElMessageBox.confirm(message, { type: 'warning' })
                            .then(() => ctx.emit("rowDelete", row, cond))
                            .catch(() => { /** Do nothing */ })
                    }
                }, () => deleteButtonText),
                h(ElButton, {
                    type: 'primary',
                    size: 'small',
                    icon: Edit,
                    onClick: () => ctx.emit('rowModify', row),
                }, () => modifyButtonText)
            ]
        })
    }
})

export default _default