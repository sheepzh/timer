import { t } from "@app/locale"
import { ElButton, ElForm, ElFormItem, ElIcon, ElMessage, ElRadio, ElRadioGroup, ElTable, ElTableColumn, ElTooltip, Sort } from "element-plus"
import { PropType, Ref, defineComponent, h, ref, computed, watch, VNode } from "vue"
import { ActionType, ImportedData, ImportedRow, processImport } from "./processor"
import { Back, Check, InfoFilled } from "@element-plus/icons-vue"
import HostAlert from "@app/components/common/host-alert"
import { isRemainHost } from "@util/constant/remain-host"
import { cvt2LocaleTime, periodFormatter } from "@app/util/time"

type SortInfo = Sort & {
    prop: keyof ImportedRow
}

const ACTION_LABELS: { [action in ActionType]: string } = {
    overwrite: t(msg => msg.dataManage.importOther.overwrite),
    accumulate: t(msg => msg.dataManage.importOther.accumulate),
}

function computeList(sort: SortInfo, originRows: ImportedRow[]): ImportedRow[] {
    const { prop, order } = sort || {}
    originRows = originRows || []
    if (!prop) {
        return originRows
    }
    const comparator = (a: ImportedRow, b: ImportedRow): number => {
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

const renderFocus = (data: ImportedData): VNode | undefined => data?.focus && h(ElTableColumn, {
    label: t(msg => msg.item.focus),
    align: 'center',
}, {
    default: () => [
        h(ElTableColumn, {
            prop: 'focus',
            sortable: true,
            label: t(msg => msg.dataManage.importOther.imported),
            align: 'center',
            minWidth: 220,
            formatter: (row: ImportedRow) => periodFormatter(row.focus, "default"),
        }),
        h(ElTableColumn, {
            label: t(msg => msg.dataManage.importOther.local),
            align: 'center',
            minWidth: 220,
            formatter: (row: ImportedRow) => {
                const localVal = row?.exist?.focus
                return localVal ? periodFormatter(localVal, "default") : '-'
            }
        }),
    ]
})

const renderTime = (data: ImportedData): VNode | undefined => data?.time && h(ElTableColumn, {
    label: t(msg => msg.item.time),
    align: 'center',
}, {
    default: () => [
        h(ElTableColumn, {
            prop: 'time',
            align: 'center',
            sortable: true,
            minWidth: 150,
            label: t(msg => msg.dataManage.importOther.imported),
            formatter: (row: ImportedRow) => (row?.time || 0).toString()
        }),
        h(ElTableColumn, {
            label: t(msg => msg.dataManage.importOther.local),
            align: 'center',
            minWidth: 150,
            formatter: (row: ImportedRow) => {
                const { exist } = row || {}
                return exist ? (exist.time || 0).toString() : '-'
            }
        })
    ]
})

const renderActionRadio = (action: Ref<ActionType>): VNode => h(ElForm, {},
    () => h(ElFormItem, { required: true }, {
        label: () => [
            t(msg => msg.dataManage.importOther.conflictType),
            h(ElTooltip, {
                content: t(msg => msg.dataManage.importOther.conflictTip),
            }, () => h(ElIcon, () => h(InfoFilled)))
        ],
        default: () => h(ElRadioGroup, {
            modelValue: action.value,
            onChange: (val: ActionType) => action.value = val,
        }, () => Object.entries(ACTION_LABELS)
            .map(([label, text]) => h(ElRadio, { label }, () => text))
        )
    })
)

const _default = defineComponent({
    props: {
        data: Object as PropType<ImportedData>
    },
    emits: {
        back: () => true,
        import: () => true,
    },
    setup(props, ctx) {
        const data: Ref<ImportedData> = ref(props.data)
        watch(() => props.data, () => data.value = props.data)

        const sort: Ref<SortInfo> = ref({ order: 'ascending', prop: 'date' })
        const action: Ref<ActionType> = ref()
        const importing: Ref<boolean> = ref(false)

        const list: Ref<ImportedRow[]> = computed(() => computeList(sort.value, data.value?.rows))

        const handleImport = () => {
            const actionVal = action.value
            if (!actionVal) {
                ElMessage.warning(t(msg => msg.dataManage.importOther.conflictNotSelected))
                return
            }
            importing.value = true
            processImport(data.value, actionVal)
                .then(() => {
                    ElMessage.success(t(msg => msg.dataManage.migrated))
                    ctx.emit('import')
                })
                .catch(e => ElMessage.error(e))
                .finally(() => importing.value = false)
        }

        return () => [
            h(ElTable, {
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
                    formatter: (row: ImportedRow) => cvt2LocaleTime(row.date)
                }),
                h(ElTableColumn, {
                    prop: 'host',
                    label: t(msg => msg.item.host),
                    sortable: true,
                    minWidth: 325,
                    align: 'center',
                    formatter: (row: ImportedRow) => h(HostAlert, { host: row.host, clickable: !isRemainHost(row.host) })
                }),
                renderFocus(data.value),
                renderTime(data.value),
            ]),
            h('div', { class: 'action-container' }, renderActionRadio(action)),
            h('div', { class: 'sop-footer' }, [
                h(ElButton, {
                    type: 'info',
                    icon: Back,
                    disabled: importing.value,
                    onClick: () => ctx.emit('back'),
                }, () => t(msg => msg.button.previous)),
                h(ElButton, {
                    type: 'success',
                    icon: Check,
                    loading: importing.value,
                    onClick: handleImport
                }, () => t(msg => msg.button.confirm)),
            ]),]
    }
})

export default _default
