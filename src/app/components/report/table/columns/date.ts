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
import { dateFormatter } from "../../formatter"

const columnLabel = t(msg => msg.item.date)

const _default = defineComponent({
    name: "DateColumn",
    setup() {
        return () => h(ElTableColumn, {
            prop: "date",
            label: columnLabel,
            minWidth: 135,
            align: "center",
            sortable: "custom"
        }, {
            default: ({ row }: { row: timer.stat.Row }) => h('span', dateFormatter(row.date))
        })
    }
})

export default _default