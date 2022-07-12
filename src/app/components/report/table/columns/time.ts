/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h } from "vue"
import { ElTableColumn } from "element-plus"
import { t } from "@app/locale"

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
            default: ({ row }: { row: timer.stat.Row }) => row.time?.toString?.() || '0'
        })
    }
})

export default _default