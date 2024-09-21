/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import PopupConfirmButton from "@app/components/common/PopupConfirmButton"
import { t } from "@app/locale"
import { Delete } from "@element-plus/icons-vue"
import siteService from "@service/site-service"
import { ElTableRowScope } from "@src/element-ui/table"
import { ElTableColumn } from "element-plus"
import { defineComponent } from "vue"

const _default = defineComponent({
    emits: {
        delete: (_row: timer.site.SiteInfo) => true,
    },
    setup(_, ctx) {
        return () => <ElTableColumn
            width={150}
            label={t(msg => msg.item.operation.label)}
            align="center"
            v-slots={
                ({ row }: ElTableRowScope<timer.site.SiteInfo>) => (
                    <PopupConfirmButton
                        buttonIcon={<Delete />}
                        buttonType="danger"
                        buttonText={t(msg => msg.button.delete)}
                        confirmText={t(msg => msg.siteManage.deleteConfirmMsg, { host: row.host })}
                        onConfirm={async () => {
                            await siteService.remove(row)
                            ctx.emit("delete", row)
                        }}
                    />
                )}
        />
    }
})

export default _default