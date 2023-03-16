/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * Column of date 
 */
import { ElTableColumn } from "element-plus"
import { defineComponent, h } from "vue"
import { t } from "@app/locale"
import Editable from "@app/components/common/editable"

const columnLabel = t(msg => msg.siteManage.column.alias)

const _default = defineComponent({
    name: "AliasColumn",
    emits: {
        aliasChange: (_host: string, _newAlias: string) => true,
    },
    setup(_, ctx) {
        return () => h(ElTableColumn, {
            label: columnLabel,
            minWidth: 140,
            align: "center"
        }, {
            default: ({ row }: { row: timer.stat.Row }) => h(Editable, {
                modelValue: row.alias,
                onChange: (newAlias: string) => ctx.emit("aliasChange", row.host, newAlias)
            })
        })
    }
})

export default _default