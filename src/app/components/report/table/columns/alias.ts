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

// Alias column
const aliasColProp = {
    label: t(msg => msg.siteManage.column.alias),
    minWidth: 140,
    align: 'center'
}
const aliasColSlots = {
    default: ({ row }: { row: DataItem }) => h('span', row.alias || '-')
}
const aliasCol = () => h(ElTableColumn, aliasColProp, aliasColSlots)
export default aliasCol
