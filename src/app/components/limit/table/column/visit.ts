/**
 * Copyright (c) 2023 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn } from "element-plus"
import { defineComponent, h } from "vue"
import { formatPeriodCommon } from "@util/time"
import { t } from "@app/locale"

const label = t(msg => msg.limit.item.visitTime)

const _default = defineComponent({
    render: () => h(ElTableColumn, {
        label,
        minWidth: 90,
        align: 'center',
    }, {
        default: ({ row }: { row: timer.limit.Item }) => {
            const visitTime = row?.visitTime
            return visitTime ? h('span', formatPeriodCommon(row.visitTime * 1000)) : '-'
        }
    })
})

export default _default