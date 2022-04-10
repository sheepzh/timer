/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn } from "element-plus"
import { defineComponent, h } from "vue"
import TimeLimitItem from "@entity/dto/time-limit-item"
import { formatPeriodCommon } from "@util/time"
import { t } from "@app/locale"

const label = t(msg => msg.limit.item.time)

const _default = defineComponent({
    name: "LimitTimeColumn",
    render: () => h(ElTableColumn, {
        prop: 'limit',
        label,
        minWidth: 100,
        align: 'center',
    }, {
        default: ({ row }: { row: TimeLimitItem }) => h('span', formatPeriodCommon(row.time * 1000))
    })
})

export default _default