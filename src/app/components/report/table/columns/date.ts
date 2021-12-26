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
import { h } from "vue"
import DataItem from "@entity/dto/data-item"
import { t } from "@app/locale"
import { dateFormatter } from "../../formatter"

// Date column
const dateColProp = {
    prop: 'date',
    label: t(msg => msg.item.date),
    minWidth: 135,
    align: 'center',
    sortable: 'custom'
}
const dateColSlots = { default: ({ row }: { row: DataItem }) => h('span', dateFormatter(row.date)) }
const dateCol = () => h(ElTableColumn, dateColProp, dateColSlots)
export default dateCol
