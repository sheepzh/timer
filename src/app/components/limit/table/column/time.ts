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
    prop: 'limit',
    label: t(msg => msg.limit.item.time),
    minWidth: 100,
    align: 'center',
}

const slots = { default: ({ row }: { row: TimeLimitItem }) => h('span', formatPeriodCommon(row.time * 1000)) }

const _default = () => h(ElTableColumn, columnProps, slots)

export default _default