/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn } from "element-plus"
import { defineComponent } from "vue"
import { t } from "@app/locale"
import Editable from "@app/components/common/editable"

const _default = defineComponent({
    emits: {
        aliasChange: (_host: string, _newAlias: string) => true,
    },
    setup(_, ctx) {
        return () => (
            <ElTableColumn
                label={t(msg => msg.siteManage.column.alias)}
                minWidth={140}
                align="center"
            >
                {
                    ({ row }: { row: timer.stat.Row }) => <Editable
                        modelValue={row.alias}
                        onChange={newAlias => ctx.emit("aliasChange", row.host, newAlias)}
                    />
                }
            </ElTableColumn>
        )
    },
})

export default _default