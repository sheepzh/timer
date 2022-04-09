/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElButton, ElTableColumn } from "element-plus"
import { t } from "@app/locale"
import { defineComponent, h, SetupContext } from "vue"
import { HostAliasInfo } from "@entity/dto/host-alias-info"
import { Delete, Edit } from "@element-plus/icons-vue"
import PopupConfirmButton from "@app/components/common/popup-confirm-button"

const deleteButtonText = t(msg => msg.siteManage.button.delete)
const deleteButton = (ctx: SetupContext<_Emit[]>, row: HostAliasInfo) => h(PopupConfirmButton, {
    buttonIcon: Delete,
    buttonType: "danger",
    buttonText: deleteButtonText,
    confirmText: t(msg => msg.siteManage.deleteConfirmMsg, { host: row.host }),
    onConfirm: () => ctx.emit("delete", row)
})

const modifyButtonText = t(msg => msg.siteManage.button.modify)
const modifyButton = (ctx: SetupContext<_Emit[]>, row: HostAliasInfo) => h(ElButton, {
    size: 'mini',
    type: "primary",
    icon: Edit,
    onClick: () => ctx.emit("modify", row)
}, () => modifyButtonText)

type _Emit = "delete" | "modify"

const label = t(msg => msg.item.operation.label)
const _default = defineComponent({
    name: "OperationColumn",
    emits: ["delete", "modify"],
    setup(_, ctx: SetupContext<_Emit[]>) {
        return () => h(ElTableColumn, {
            minWidth: 100,
            label,
            align: 'center',
            fixed: 'right'
        }, {
            default: ({ row }: { row: HostAliasInfo }) => [
                modifyButton(ctx, row),
                deleteButton(ctx, row)
            ]
        })
    }
})

export default _default