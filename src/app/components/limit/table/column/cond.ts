/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn } from "element-plus"
import { defineComponent, h } from "vue"
import { t } from "@app/locale"

const label = t(msg => msg.limit.item.condition)
const _default = defineComponent({
    name: "LimitCondColumn",
    render: () => h(ElTableColumn, {
        prop: 'cond',
        label,
        minWidth: 250,
        align: 'center',
    }, {
        default: ({ row }: { row: timer.limit.Item }) => h('span', row.cond)
    })
})

export default _default