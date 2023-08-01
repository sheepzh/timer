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
import { computed, defineComponent, h, PropType, ref, Ref, VNode, watch } from "vue"
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


const renderFocus = (data: timer.imported.Data, comparedColName: string): VNode | undefined => data?.focus && h(ElTableColumn, {
    label: t(msg => msg.item.focus),
    align: 'center',
}, {
    default: () => [
        h(ElTableColumn, {
            prop: 'focus',
            sortable: true,
            label: comparedColName,
            align: 'center',
            minWidth: 180,
            formatter: (row: timer.imported.Row) => periodFormatter(row.focus, "default"),
        }),
        h(ElTableColumn, {
            label: t(msg => msg.dataManage.importOther.local),
            align: 'center',
            minWidth: 180,
            formatter: (row: timer.imported.Row) => {
                const localVal = row?.exist?.focus
                return localVal ? periodFormatter(localVal, "default") : '-'
            }
        }),
    ]
})

const renderTime = (data: timer.imported.Data, comparedColName: string): VNode | undefined => data?.time && h(ElTableColumn, {
    label: t(msg => msg.item.time),
    align: 'center',
}, {
    default: () => [
        h(ElTableColumn, {
            prop: 'time',
            align: 'center',
            sortable: true,
            minWidth: 150,
            label: comparedColName,
            formatter: (row: timer.imported.Row) => (row?.time || 0).toString()
        }),
        h(ElTableColumn, {
            label: t(msg => msg.dataManage.importOther.local),
            align: 'center',
            minWidth: 150,
            formatter: (row: timer.imported.Row) => {
                const { exist } = row || {}
                return exist ? (exist.time || 0).toString() : '-'
            }
        })
    ]
})

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

        return () => h(ElTable, {
            size: 'small',
            maxHeight: '45vh',
            border: true,
            highlightCurrentRow: true,
            fit: true,
            defaultSort: sort.value,
            "onSort-change": newSort => sort.value = newSort,
            data: list.value || [],
        }, () => [
            h(ElTableColumn, { type: 'index', align: 'center' }),
            h(ElTableColumn, {
                prop: 'date',
                label: t(msg => msg.item.date),
                sortable: true,
                align: 'center',
                minWidth: 120,
                formatter: (row: timer.imported.Row) => cvt2LocaleTime(row.date)
            }),
            h(ElTableColumn, {
                prop: 'host',
                label: t(msg => msg.item.host),
                sortable: true,
                minWidth: 300,
                align: 'center',
                formatter: (row: timer.imported.Row) => h(HostAlert, { host: row.host, clickable: !isRemainHost(row.host) })
            }),
            renderFocus(data.value, props.comparedColName),
            renderTime(data.value, props.comparedColName),
        ])
    }
})

export default _default