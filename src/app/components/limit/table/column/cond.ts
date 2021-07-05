import { ElTableColumn } from "element-plus"
import { h } from "vue"
import TimeLimitItem from "../../../../../entity/dto/time-limit-item"
import { t } from "../../../../locale"

const columnProps = {
    prop: 'cond',
    label: t(msg => msg.limit.item.condition),
    minWidth: 250,
    align: 'center',
}

const slots = { default: ({ row }: { row: TimeLimitItem }) => h('span', row.cond) }

const _default = () => h(ElTableColumn, columnProps, slots)

export default _default