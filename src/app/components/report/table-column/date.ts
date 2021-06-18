/**
 * Column of date 
 */
import { ElTableColumn } from "element-plus"
import { h } from "vue"
import SiteInfo from "../../../../entity/dto/site-info"
import { t } from "../../../locale"
import { dateFormatter } from "../formatter"

// Date column
const dateColProp = {
    prop: 'date',
    label: t(msg => msg.item.date),
    minWidth: 200,
    align: 'center',
    sortable: 'custom'
}
const dateColSlots = { default: ({ row }: { row: SiteInfo }) => h('span', dateFormatter(row.date)) }
const dateCol = () => h(ElTableColumn, dateColProp, dateColSlots)
export default dateCol
