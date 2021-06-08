import { ElButton, ElDatePicker, ElDropdown, ElDropdownMenu, ElDropdownItem, ElInput, ElLink, ElMessage, ElPagination, ElPopconfirm, ElSwitch, ElTable, ElTableColumn, ElTooltip } from "element-plus"
import { computed, defineComponent, h, reactive, Ref, ref, UnwrapRef } from "vue"
import { t } from "../../../common/vue-i18n"
import { DATE_FORMAT } from "../../../database/constant"
import timerDatabase from "../../../database/timer-database"
import SiteInfo, { SiteItem } from "../../../entity/dto/site-info"
import timerService, { SortDirect } from "../../../service/timer-service"
import whitelistService from "../../../service/whitelist-service"
import { FAVICON } from "../../../util/constant/url"
import { exportCsv, exportJson } from "../../../util/file"
import { formatPeriodCommon, formatTime, MILL_PER_DAY } from "../../../util/time"
import './styles/element'
import './styles/filter'

enum ElSortDirect {
    ASC = 'ascending',
    DESC = 'descending'
}

type SortInfo = {
    prop: SiteItem | 'host'
    order: ElSortDirect
}

const DISPLAY_DATE_FORMAT = '{y}/{m}/{d}'
const dateFormatter = ({ date }) => date ? date.substring(0, 4) + '/' + date.substring(4, 6) + '/' + date.substring(6, 8) : '-'

const hostRef: Ref<string> = ref('')
const dateRangeRef: Ref<Array<Date>> = ref([])
const mergeDateRef: Ref<boolean> = ref(false)
const mergeDomainRef: Ref<boolean> = ref(false)
const displayBySecondRef: Ref<boolean> = ref(false)
const dataRef: Ref<SiteInfo[]> = ref([])
const whitelistRef: Ref<Array<string>> = ref([])
const sortRef: UnwrapRef<SortInfo> = reactive({
    prop: 'focus',
    order: ElSortDirect.DESC
})
const pageRef = reactive({
    size: 10,
    num: 1,
    total: 0
})
const deleteMsgRef: Ref<string> = ref('')
const changeDeleteConfirmUrl = (row: SiteInfo) => {
    const { host } = row
    const dateRange = dateRangeRef.value
    if (mergeDateRef.value) {
        if (!dateRange.length) {
            // Delete all
            deleteMsgRef.value = t('item.operation.deleteConfirmMsgAll', { url: host })
        } else {
            const start = dateRange[0]
            const end = dateRange[1]
            if (start === end) {
                // Among one day
                deleteMsgRef.value = t('item.operation.deleteConfirmMsg', { url: host, date: formatTime(start, DISPLAY_DATE_FORMAT) })
            } else {
                // Period
                deleteMsgRef.value = t('item.operation.deleteConfirmMsgRange',
                    { url: host, start: formatTime(start, DISPLAY_DATE_FORMAT), end: formatTime(end, DISPLAY_DATE_FORMAT) }
                )
            }
        }
    } else {
        // Not merge, delete one item
        deleteMsgRef.value = t('item.operation.deleteConfirmMsg', { url: host, date: dateFormatter(row) })
    }
}

const periodFormatter = (val: number, hideUnitOfSecond?: boolean, force2DisplayBySecond?: boolean) => {
    if (val === undefined) {
        return force2DisplayBySecond ? '0' : '-'
    } else {
        const bySecond = displayBySecondRef.value || force2DisplayBySecond
        const second = Math.floor(val / 1000)
        return bySecond ? (second + (hideUnitOfSecond ? '' : ' s')) : formatPeriodCommon(val)
    }
}

const queryParam = computed(() => {
    return {
        host: hostRef.value,
        date: dateRangeRef.value,
        mergeDomain: mergeDomainRef.value,
        mergeDate: mergeDateRef.value,
        sort: sortRef.prop,
        sortOrder: sortRef.order === ElSortDirect.ASC ? SortDirect.ASC : SortDirect.DESC
    }
})

const exportFileName = computed(() => {
    let baseName = t('report.exportFileName')
    const dateRange = dateRangeRef.value
    if (dateRange && dateRange.length === 2) {
        const start = dateRange[0]
        const end = dateRange[1]
        if (start === end) {
            baseName += '_' + formatTime(start, '{y}{m}{d}')
        } else {
            baseName += '_' + formatTime(start, '{y}{m}{d}') + '_' + formatTime(end, '{y}{m}{d}')
        }
    }
    mergeDateRef.value && (baseName += '_' + t('report.mergeDate'))
    mergeDomainRef.value && (baseName += '_' + t('report.mergeDomain'))
    displayBySecondRef.value && (baseName += '_' + t('report.displayBySecond'))
    return baseName
})

const queryData = () => {
    const page = {
        pageSize: pageRef.size,
        pageNum: pageRef.num
    }
    timerService
        .selectByPage(queryParam.value, page)
        .then(({ list, total }) => {
            dataRef.value = list
            pageRef.total = total
        })
}
const queryWhiteList = async () => {
    const whitelist = await whitelistService.listAll()
    whitelistRef.value = whitelist
    return await Promise.resolve()
}

const host2ElLink = (host: string) => {
    const link = h(ElLink,
        { href: `https://${host}`, target: '_blank' },
        () => host
    )
    const icon = h('span',
        { style: 'height:23px;line-height:23px;padding-left:2px;' },
        h('img',
            {
                src: FAVICON(host),
                width: 12,
                height: 12
            }
        )
    )
    return [link, icon]
}

type ExportInfo = {
    host: string
    date?: string
    total?: string
    focus?: string
    time?: number
}

type FileFormat = 'json' | 'csv'

const exportFile = (format: FileFormat) => {
    const rows = dataRef.value
    if (format === 'json') {
        const toExport: ExportInfo[] = rows.map(row => {
            const data: ExportInfo = { host: row.host }
            // Always display by seconds
            data.total = periodFormatter(row.total, true, true)
            data.focus = periodFormatter(row.focus, true, true)
            data.time = row.time
            return data
        })
        exportJson(toExport, exportFileName.value)
    } else if (format === 'csv') {
        let columnName = []
        !mergeDateRef.value && columnName.push('date')
        columnName = [...columnName, 'host', 'total', 'focus', 'time']
        const data = [columnName.map(c => t(`item.${c}`))]
        rows.forEach(row => {
            const csvR = []
            !mergeDateRef.value && csvR.push(dateFormatter(row))
            data.push([...csvR, row.host, periodFormatter(row.total, true), periodFormatter(row.focus, true), row.time])
        })
        exportCsv(data, exportFileName.value)
    }
}

export default defineComponent(() => {
    queryWhiteList().then(queryData)
    // filter items
    const filterItemClz = 'filter-item'
    // host
    const host = () => h(ElInput,
        {
            placeholder: t('report.hostPlaceholder'),
            clearable: true,
            modelValue: hostRef.value,
            class: filterItemClz,
            onInput: (val: string) => hostRef.value = val.trim(),
            onClear: () => hostRef.value = '',
            onKeyup: (event: KeyboardEvent) => event.key === 'Enter' && queryData()
        }
    )

    // date range
    const daysAgo = (start: number, end: number) => {
        const current = new Date().getTime()
        return [new Date(current - start * MILL_PER_DAY), new Date(current - end * MILL_PER_DAY)]
    }
    const datePickerShortcut = (msg: string, agoOfStart?: number, agoOfEnd?: number) => {
        return {
            text: t(`report.${msg}`),
            value: daysAgo(agoOfStart || 0, agoOfEnd || 0)
        }
    }
    const dateRangePicker = () => h(ElDatePicker,
        {
            modelValue: dateRangeRef.value,
            format: 'YYYY/MM/DD',
            type: 'daterange',
            rangeSeparator: '-',
            disabledDate: (date: Date | number) => new Date(date) > new Date(),
            shortcuts: [
                datePickerShortcut('today'),
                datePickerShortcut('yesterday', 1, 1),
                datePickerShortcut('latestWeek', 7),
                datePickerShortcut('latest30Days', 30)
            ],
            'onUpdate:modelValue': (date: Array<Date>) => {
                dateRangeRef.value = date
                queryData()
            },
            startPlaceholder: t('report.startDate'),
            endPlaceholder: t('report.endDate')
        })
    const dateRange = () => h('span', { class: filterItemClz }, [dateRangePicker()])
    // Merge date
    const mergeDateName = () => h('a', { class: 'filter-name' }, t('report.mergeDate'))
    const mergeDate = () => h(ElSwitch,
        {
            class: filterItemClz,
            modelValue: mergeDateRef.value,
            onChange: (val: boolean) => {
                mergeDateRef.value = val
                queryData()
            }
        }
    )
    // Merge domain 
    const mergeDomainName = () => h('a', { class: 'filter-name' }, t('report.mergeDomain'))
    const mergeDomain = () => h(ElSwitch,
        {
            class: filterItemClz,
            modelValue: mergeDomainRef.value,
            onChange: (val: boolean) => {
                mergeDomainRef.value = val
                queryData()
            }
        }
    )
    // Display by second
    const displayBySecondName = () => h('a', { class: 'filter-name' }, t('report.displayBySecond'))
    const displayBySecond = () => h(ElSwitch,
        {
            class: filterItemClz,
            modelValue: displayBySecondRef.value,
            onChange: (val: boolean) => displayBySecondRef.value = val
        }
    )

    const downloadFile = () => h(ElDropdown,
        { class: 'export-dropdown', showTimeout: 100 },
        {
            default: () => h(ElButton,
                { size: 'mini', class: 'export-dropdown-button' },
                () => h('i', { class: 'el-icon-download export-dropdown-menu-icon' })
            ),
            dropdown: () => h(ElDropdownMenu, {},
                () => (['csv', 'json'] as FileFormat[])
                    .map(format => h(ElDropdownItem, { onClick: () => exportFile(format) }, () => format))
            )
        }
    )
    const filter = () => h('div', { class: 'filter-container' },
        [host(), dateRange(), mergeDateName(), mergeDate(), mergeDomainName(), mergeDomain(), displayBySecondName(), displayBySecond(), downloadFile()]
    )

    // Table
    const columns = () => {
        const result = []
        // Date column
        mergeDateRef.value || result.push(
            h(ElTableColumn,
                {
                    prop: 'date',
                    label: t('item.date'),
                    minWidth: 200,
                    align: 'center',
                    sortable: 'custom'
                },
                { default: ({ row }: { row: SiteInfo }) => h('span', dateFormatter(row)) }
            )
        )
        // Host column
        result.push(
            h(ElTableColumn, {
                prop: 'host',
                label: t('item.host'),
                minWidth: 300,
                sortable: 'custom',
                align: 'center'
            }, {
                default: ({ row }: { row: SiteInfo }) => {
                    if (!mergeDomainRef.value) {
                        return host2ElLink(row.host)
                    } else {
                        return h(ElTooltip,
                            {
                                placement: 'left',
                                effect: 'light',
                                offset: 10
                            }, {
                            default: () =>
                                // Fake ElLink
                                h('a',
                                    { class: 'el-link el-link--default is-underline' },
                                    h('span', { class: 'el-link--inner' }, row.host)
                                ),
                            content: () => h('div', { style: 'margin: 10px' }, row.mergedHosts.map(host => h('p', host2ElLink(host))))
                        })
                    }
                }
            })
        )
        // focus total time
        result.push(
            h(ElTableColumn, {
                prop: 'focus',
                label: t('item.focus'),
                minWidth: 220,
                align: 'center',
                sortable: 'custom'
            }, { default: ({ row }: { row: SiteInfo }) => periodFormatter(row.focus) }),
            h(ElTableColumn, {
                prop: 'total',
                label: t('item.total'),
                minWidth: 220,
                align: 'center',
                sortable: 'custom'
            }, { default: ({ row }: { row: SiteInfo }) => periodFormatter(row.total) }),
            h(ElTableColumn, {
                prop: 'time',
                label: t('item.time'),
                minWidth: 130,
                align: 'center',
                sortable: 'custom'
            }, { default: ({ row }: { row: SiteInfo }) => h('span', row.time || 0) })
        )
        if (!mergeDomainRef.value) {
            // Operations
            const operations = (row: SiteInfo) => {
                const operationButtons = []
                const { host, date } = row
                // Delete button 
                operationButtons.push(h(ElPopconfirm,
                    {
                        confirmButtonText: t('item.operation.confirmMsg'),
                        cancelButtonText: t('item.operation.cancelMsg'),
                        title: deleteMsgRef.value,
                        onConfirm: () => {
                            if (mergeDateRef.value) {
                                const dateRange = dateRangeRef.value
                                if (!dateRange || !dateRange.length) {
                                    // Delete all
                                    timerDatabase.deleteByUrl(host).then(queryData)
                                } else {
                                    // Delete by range
                                    timerDatabase.deleteByUrlBetween(
                                        host,
                                        formatTime(dateRange[0], DATE_FORMAT),
                                        formatTime(dateRange[1], DATE_FORMAT)
                                    ).then(queryData)
                                }
                            } else {
                                // Delete by date
                                timerDatabase.deleteByUrlAndDate(host, date).then(queryData)
                            }
                        }
                    }, {
                    reference: () => h(ElButton, {
                        size: 'mini',
                        type: 'warning',
                        onClick: () => changeDeleteConfirmUrl(row),
                        icon: 'el-icon-delete'
                    }, () => t('item.operation.delete'))
                }))
                // Add 2 the whitelist
                if (!whitelistRef.value.includes(host)) {
                    operationButtons.push(h(ElPopconfirm, {
                        confirmButtonText: t("item.operation.confirmMsg"),
                        cancelButtonText: t('item.operation.cancelMsg'),
                        title: t('setting.whitelist.addConfirmMsg', { url: host }),
                        icon: 'el-icon-info',
                        iconColor: 'red',
                        onConfirm: () => {
                            whitelistService
                                .add(host)
                                .then(() => {
                                    queryWhiteList().then(queryData)
                                    ElMessage({ message: t('report.added2Whitelist'), type: 'success' })
                                })
                        }
                    }, {
                        reference: () => h(ElButton, { size: 'mini', type: 'danger', icon: 'el-icon-plus' }, () => t('item.operation.add2Whitelist'))
                    }))
                } else {
                    operationButtons.push(h(ElPopconfirm, {
                        confirmButtonText: t("item.operation.confirmMsg"),
                        cancelButtonText: t('item.operation.cancelMsg'),
                        title: t('setting.whitelist.removeConfirmMsg', { url: row.host }),
                        icon: 'el-icon-info',
                        iconColor: '#409eff',
                        onConfirm: () => {
                            whitelistService
                                .remove(host)
                                .then(() => {
                                    queryWhiteList()
                                    ElMessage({ message: t('report.removeFromWhitelist'), type: 'success' });
                                })
                        }
                    }, {
                        reference: () => h(ElButton, { size: 'mini', type: 'primary', icon: 'el-icon-open' }, () => t('item.operation.removeFromWhitelist'))
                    }))
                }
                return operationButtons
            }
            result.push(h(ElTableColumn, {
                label: t('item.operation.label'),
                minWidth: 240,
                align: 'center'
            }, {
                default: (data: { row: SiteInfo }) => operations(data.row)
            }))
        }

        return result
    }

    const table = () => h(ElTable, {
        data: dataRef.value,
        border: true,
        size: 'mini',
        defaultSort: sortRef,
        style: 'width:100%',
        highlightCurrentRow: true,
        fit: true,
        onSortChange: (newSort: SortInfo) => {
            sortRef.order = newSort.order
            sortRef.prop = newSort.prop
            queryData()
        }
    }, () => columns())

    const pagination = () => h('div',
        { class: 'pagination-container' },
        h(ElPagination,
            {
                onSizeChange: (size: number) => {
                    pageRef.size = size
                    queryData()
                },
                onCurrentChange: (pageNum: number) => {
                    pageRef.num = pageNum
                    queryData()
                },
                currentPage: pageRef.num,
                pageSizes: [10, 20, 50],
                pageSize: pageRef.size,
                layout: "total, sizes, prev, pager, next, jumper",
                total: pageRef.total
            }
        )
    )

    return () => h('div', { class: 'content-container' }, [filter(), table(), pagination()])
})