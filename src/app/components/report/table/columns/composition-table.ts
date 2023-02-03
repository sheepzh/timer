/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { computed, ComputedRef, defineComponent, h, PropType } from "vue"
import { ElTable, ElTableColumn } from "element-plus"
import { sum } from "@util/array"
import { t } from "@app/locale"

type Row = {
    name: string
    value: number
    percent?: string
}

type ValueFormatter = (val: number) => string

const CLIENT_NAME = t(msg => msg.report.remoteReading.table.client)
const VALUE = t(msg => msg.report.remoteReading.table.value)
const LOCAL_DATA = t(msg => msg.report.remoteReading.table.localData)
const PERCENTAGE = t(msg => msg.report.remoteReading.table.percentage)

function computeRows(data: timer.stat.RemoteCompositionVal[]): Row[] {
    const rows: Row[] = data.map(e => typeof e === 'number'
        ? { name: LOCAL_DATA, value: e || 0 }
        : { name: e.cname || e.cid, value: e.value }
    )
    const total = sum(rows.map(row => row.value))
    total && rows.forEach(row => row.percent = (row.value / total * 100).toFixed(2) + ' %')
    rows.sort((a, b) => b.value - a.value)
    return rows
}

const _default = defineComponent({
    name: 'CompositionChart',
    props: {
        data: Array as PropType<timer.stat.RemoteCompositionVal[]>,
        valueFormatter: Function as PropType<ValueFormatter>,
    },
    setup(props) {
        const rows: ComputedRef<Row[]> = computed(() => computeRows(props.data))
        return () => h('div', { style: { width: '400px' } },
            h(ElTable, {
                data: rows.value,
                size: 'small',
                border: true,
            }, () => [
                h(ElTableColumn, {
                    label: CLIENT_NAME,
                    formatter: (row: Row) => row.name,
                    align: 'center',
                    width: 150,
                }),
                h(ElTableColumn, {
                    label: VALUE,
                    formatter: (row: Row) => props.valueFormatter(row.value),
                    align: 'center',
                    width: 150,
                }),
                h(ElTableColumn, {
                    label: PERCENTAGE,
                    align: 'center',
                    formatter: (row: Row) => row.percent,
                    width: 100,
                }),
            ])
        )
    }
})

export default _default