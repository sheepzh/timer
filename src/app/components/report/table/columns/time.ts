/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h } from "vue"
import { ElTableColumn } from "element-plus"
import { t } from "@app/locale"
import DataItem from "@entity/dto/data-item"

const columnLabel = t(msg => msg.item.time)

const _default = defineComponent({
    name: "TimeColumn",
    setup() {
        return () => h(ElTableColumn, {
            prop: "time",
            label: columnLabel,
            minWidth: 130,
            align: 'center',
            sortable: 'custom'
        }, {
            default: ({ row }: { row: DataItem }) => row.time?.toString?.() || '0'
        })
    }
})

export default _default