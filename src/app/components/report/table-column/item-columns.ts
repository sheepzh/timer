import { ElTableColumn } from "element-plus"
import SiteInfo, { SiteItemVal } from "../../../../entity/dto/site-info"
import { ItemMessage } from "../../../../util/i18n/components/item"
import { t } from "../../../locale"
import { h, Ref } from 'vue'
import { periodFormatter } from "../formatter"

export type ItemColumnProps = {
    displayBySecondRef: Ref<boolean>
}

// focus total time
const dataCol = (itemKey: keyof ItemMessage, propName: keyof SiteItemVal, fomatter: (val: number) => string) =>
    h(ElTableColumn, {
        prop: propName,
        label: t(msg => msg.item[itemKey]),
        minWidth: 220,
        align: 'center',
        sortable: 'custom'
    }, { default: ({ row }: { row: SiteInfo }) => fomatter(row[propName]) })

const focusCol = (props: ItemColumnProps) => dataCol('focus', 'focus', millsecond => periodFormatter(millsecond, props.displayBySecondRef.value))
const totalCol = (props: ItemColumnProps) => dataCol("total", "total", millsecond => periodFormatter(millsecond, props.displayBySecondRef.value))
const timeCol = () => dataCol('time', 'time', val => val ? val.toString() : '0')

const itemColumns = (props: ItemColumnProps) => [focusCol(props), totalCol(props), timeCol()]

export default itemColumns