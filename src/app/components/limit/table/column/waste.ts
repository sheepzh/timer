/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn } from "element-plus"
import { h } from "vue"
import TimeLimitItem from "@entity/dto/time-limit-item"
import { formatPeriodCommon } from "@util/time"
import { t } from "@app/locale"

const columnProps = {
    prop: 'waste',
    label: t(msg => msg.limit.item.waste),
    minWidth: 100,
    align: 'center',
}

const slots = { default: ({ row }: { row: TimeLimitItem }) => h('span', formatPeriodCommon(row.waste)) }

const _default = () => h(ElTableColumn, columnProps, slots)

export default _default