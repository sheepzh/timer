/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn } from "element-plus"
import { defineComponent, h } from "vue"
import { formatPeriodCommon } from "@util/time"
import { t } from "@app/locale"

const label = t(msg => msg.limit.item.waste)
const _default = defineComponent({
    name: "LimitWasteColumn",
    render: () => h(ElTableColumn, {
        prop: 'waste',
        label,
        minWidth: 90,
        align: 'center',
    }, {
        default: ({ row }: { row: timer.limit.Item }) => h('span', formatPeriodCommon(row.waste))
    })
}
)

export default _default