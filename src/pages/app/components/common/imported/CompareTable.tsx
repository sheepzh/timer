/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import HostAlert from "@app/components/common/HostAlert"
import { t } from "@app/locale"
import { cvt2LocaleTime, periodFormatter } from "@app/util/time"
import { useState } from "@hooks"
import { Column, ElTableColumn, ElTableV2, type SortBy, TableV2SortOrder } from "element-plus"
import { computed, defineComponent, toRef, type VNode } from "vue"

type SortInfo = SortBy & {
    key: keyof timer.imported.Row
}

function computeList(sort: SortInfo, originRows: timer.imported.Row[]): timer.imported.Row[] {
    const { key, order } = sort || {}
    originRows = originRows || []
    if (!key) {
        return originRows
    }
    const prop = key as keyof timer.imported.Row
    const comparator = (a: timer.imported.Row, b: timer.imported.Row): number => {
        const av = a[prop] ?? 0, bv = b[prop] ?? 0
        if (av == bv) return 0
        if (order === TableV2SortOrder.DESC) {
            return av > bv ? -1 : 1
        } else {
            return av > bv ? 1 : -1
        }
    }
    return originRows.sort(comparator)
}

const renderFocus = (data: timer.imported.Data, comparedColName: string): VNode | undefined => {
    if (!data?.focus) return
    return (
        <ElTableColumn label={t(msg => msg.item.focus)} align="center">
            <ElTableColumn
                prop="focus"
                sortable
                label={comparedColName}
                align="center"
                minWidth={180}
                formatter={(row: timer.imported.Row) => periodFormatter(row.focus)}
            />
            <ElTableColumn
                label={t(msg => msg.dataManage.importOther.local)}
                align="center"
                minWidth={180}
                formatter={(row: timer.imported.Row) => {
                    const localVal = row?.exist?.focus
                    return localVal ? periodFormatter(localVal) : '-'
                }}
            />
        </ElTableColumn>
    )
}

const FOCUS_COLUMN: Column<timer.imported.Row> = {
    width: 100,
    headerCellRenderer: () => <>
        {/** TODO: finish level headers */}
    </>,
}

const renderTime = (data: timer.imported.Data, comparedColName: string): VNode | undefined => {
    if (!data?.time) return
    return (
        <ElTableColumn label={t(msg => msg.item.time)} align="center">
            <ElTableColumn
                prop="time"
                align="center"
                sortable minWidth={150}
                label={comparedColName}
                formatter={(row: timer.imported.Row) => (row?.time || 0).toString()}
            />
            <ElTableColumn
                label={t(msg => msg.dataManage.importOther.local)}
                align="center"
                minWidth={150}
                formatter={({ exist }: timer.imported.Row) => exist ? (exist.time || 0).toString() : '-'}
            />
        </ElTableColumn>
    )
}

type Props = {
    data: timer.imported.Data
    comparedColName: string
}

const COLUMNS: Column<timer.imported.Row>[] = [
    {
        align: 'center',
        width: 80,
        fixed: true,
    }, {
        width: 140,
        sortable: true,
        align: 'center',
        minWidth: 120,
        headerCellRenderer: () => <span>{t(msg => msg.item.date)}</span>,
        cellRenderer: ({ cellData }) => <span>{cvt2LocaleTime(cellData.date)}</span>,
    }, {
        width: 200,
        minWidth: 300,
        sortable: true,
        align: 'center',
        headerCellRenderer: () => <span>{t(msg => msg.item.host)}</span>,
        cellRenderer: ({ cellData: { host } }) => <HostAlert value={{ host, type: 'normal' }} clickable={false} />,
    }
]

const _default = defineComponent<Props>((props) => {
    const data = toRef(props, 'data')
    const [sort, setSort] = useState<SortInfo>({ order: TableV2SortOrder.ASC, key: 'date' })
    const list = computed(() => computeList(sort.value, data.value?.rows))

    return () => (
        <ElTableV2
            // style={{ maxHeight: '45vh' }}
            height={400}
            width={1200}
            sortBy={sort.value}
            onSort-change={setSort}
            data={list.value || []}
            columns={[...COLUMNS]}
        >
            <ElTableColumn type="index" align="center" />
            <ElTableColumn
                prop="date"
                label={t(msg => msg.item.date)}
                sortable
                align="center"
                minWidth={120}
                formatter={(row: timer.imported.Row) => cvt2LocaleTime(row.date)}
            />
            <ElTableColumn
                prop="host"
                label={t(msg => msg.item.host)}
                sortable
                minWidth={300}
                align="center"
                formatter={({ host }: timer.imported.Row) => <HostAlert value={{ host, type: 'normal' }} clickable={false} />}
            />
            {renderFocus(data.value, props.comparedColName)}
            {renderTime(data.value, props.comparedColName)}
        </ElTableV2>
    )
}, { props: ['data', 'comparedColName'] })

export default _default