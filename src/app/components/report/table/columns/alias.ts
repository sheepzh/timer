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
import DataItem from "@entity/dto/data-item"
import { t } from "@app/locale"

const columnLabel = t(msg => msg.siteManage.column.alias)

const _default = defineComponent({
    name: "AliasColumn",
    setup() {
        return () => h(ElTableColumn, {
            label: columnLabel,
            minWidth: 140,
            align: "center"
        }, {
            default: ({ row }: { row: DataItem }) => h('span', row.alias || '-')
        })
    }
})

export default _default