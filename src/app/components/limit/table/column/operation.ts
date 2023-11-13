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
import optionService from "@service/option-service"
import { judgeVerificationRequired, processVerification } from "./common"

const label = t(msg => msg.limit.item.operation)
const deleteButtonText = t(msg => msg.button.delete)
const modifyButtonText = t(msg => msg.button.modify)

async function handleDelete(row: timer.limit.Item, callback: () => void) {
    let promise = undefined
    if (await judgeVerificationRequired(row)) {
        const option = await optionService.getAllOption() as timer.option.DailyLimitOption
        promise = processVerification(option)
    }
    if (!promise) {
        const message = t(msg => msg.limit.message.deleteConfirm, { cond: row.cond })
        promise = ElMessageBox.confirm(message, { type: 'warning' })
    }
    promise.then(callback).catch(() => { /** Do nothing */ })
}

async function handleModify(row: timer.limit.Item, callback: () => void) {
    let promise: Promise<void> = undefined
    if (await judgeVerificationRequired(row)) {
        const option = await optionService.getAllOption() as timer.option.DailyLimitOption
        promise = processVerification(option)
        promise
            ? promise.then(callback).catch(() => { })
            : callback()
    } else {
        callback()
    }
}

const _default = defineComponent({
    emits: {
        rowDelete: (_row: timer.limit.Item, _cond: string) => true,
        rowModify: (_row: timer.limit.Item) => true,
    },
    setup(_props, ctx) {
        return () => h(ElTableColumn, {
            prop: 'operations',
            label,
            width: 200,
            align: 'center',
        }, {
            default: ({ row }: { row: timer.limit.Item }) => [
                h(ElButton, {
                    type: 'danger',
                    size: 'small',
                    icon: Delete,
                    onClick: () => handleDelete(row, () => ctx.emit("rowDelete", row, row.cond))
                }, () => deleteButtonText),
                h(ElButton, {
                    type: 'primary',
                    size: 'small',
                    icon: Edit,
                    onClick: () => handleModify(row, () => ctx.emit('rowModify', row)),
                }, () => modifyButtonText)
            ]
        })
    }
})

export default _default