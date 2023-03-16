/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { SetupContext } from "vue"

import { ElTableColumn } from "element-plus"
import { t } from "@app/locale"
import { defineComponent, h } from "vue"
import { Delete } from "@element-plus/icons-vue"
import PopupConfirmButton from "@app/components/common/popup-confirm-button"
import siteService from "@service/site-service"

type _Emit = {
    delete: (row: timer.site.SiteInfo) => void
    modify: (row: timer.site.SiteInfo) => void
}

const deleteButtonText = t(msg => msg.siteManage.button.delete)
const deleteButton = (ctx: SetupContext<_Emit>, row: timer.site.SiteInfo) => h(PopupConfirmButton, {
    buttonIcon: Delete,
    buttonType: "danger",
    buttonText: deleteButtonText,
    confirmText: t(msg => msg.siteManage.deleteConfirmMsg, { host: row.host }),
    onConfirm: async () => {
        await siteService.remove(row)
        ctx.emit("delete", row)
    }
})

const label = t(msg => msg.item.operation.label)
const _default = defineComponent({
    name: "OperationColumn",
    emits: {
        delete: (_row: timer.site.SiteInfo) => true,
        modify: () => true,
    },
    setup(_, ctx: SetupContext<_Emit>) {
        return () => h(ElTableColumn, {
            minWidth: 100,
            label,
            align: 'center',
        }, {
            default: ({ row }: { row: timer.site.SiteInfo }) => deleteButton(ctx, row)
        })
    }
})

export default _default