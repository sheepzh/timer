/**
 * Copyright (c) 2023-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { cvt2LocaleTime, periodFormatter } from "@app/util/time"

import { isRemainHost } from "@util/constant/remain-host"
import { ElTable, ElTableColumn, Sort } from "element-plus"
import HostAlert from "@app/components/common/host-alert"
import { computed, defineComponent, PropType, ref, Ref, VNode, watch } from "vue"
import { t } from "@app/locale"

type SortInfo = Sort & {
    prop: keyof timer.imported.Row
}

function computeList(sort: SortInfo, originRows: timer.imported.Row[]): timer.imported.Row[] {
    const { prop, order } = sort || {}
    originRows = originRows || []
    if (!prop) {
        return originRows
    }
    const comparator = (a: timer.imported.Row, b: timer.imported.Row): number => {
        const av = a[prop], bv = b[prop]
        if (av == bv) return 0
        if (order === 'descending') {
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

const _default = defineComponent({
    props: {
        data: Object as PropType<timer.imported.Data>,
        comparedColName: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const data: Ref<timer.imported.Data> = ref(props.data)
        watch(() => props.data, () => data.value = props.data)
        const sort: Ref<SortInfo> = ref({ order: 'ascending', prop: 'date' })

        const list: Ref<timer.imported.Row[]> = computed(() => computeList(sort.value, data.value?.rows))
        return () => (
            <ElTable
                size="small"
                maxHeight="45vh"
                border
                highlightCurrentRow
                fit
                defaultSort={sort.value}
                onSort-change={newSort => sort.value = newSort}
                data={list.value || []}
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
                    formatter={({ host }: timer.imported.Row) => <HostAlert host={host} clickable={!isRemainHost(host)} />}
                />
                {renderFocus(data.value, props.comparedColName)}
                {renderTime(data.value, props.comparedColName)}
            </ElTable>
        )
    }
})

export default _default