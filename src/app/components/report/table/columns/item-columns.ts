/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn } from "element-plus"
import DataItem, { DataItemVal } from "@entity/dto/data-item"
import { ItemMessage } from "@util/i18n/components/item"
import { t } from "@app/locale"
import { h, Ref } from "vue"
import { periodFormatter } from "../../formatter"

export type ItemColumnProps = {
    displayBySecondRef: Ref<boolean>
}

// focus total time
const dataCol = (itemKey: keyof ItemMessage, propName: keyof DataItemVal, formatter: (val: number) => string) =>
    h(ElTableColumn, {
        prop: propName,
        label: t(msg => msg.item[itemKey]),
        minWidth: 130,
        align: 'center',
        sortable: 'custom'
    }, { default: ({ row }: { row: DataItem }) => formatter(row[propName]) })

const focusCol = (props: ItemColumnProps) => dataCol('focus', 'focus', millisecond => periodFormatter(millisecond, props.displayBySecondRef.value))
const totalCol = (props: ItemColumnProps) => dataCol("total", "total", millisecond => periodFormatter(millisecond, props.displayBySecondRef.value))
const timeCol = () => dataCol('time', 'time', val => val ? val.toString() : '0')

const itemColumns = (props: ItemColumnProps) => [focusCol(props), totalCol(props), timeCol()]

export default itemColumns