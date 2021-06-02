import { ElButton, ElDatePicker, ElInput, ElMessage, ElMessageBox, ElTooltip } from "element-plus"
import { defineComponent, h, ref, Ref, SetupContext, VNode } from "vue"
import { t, tN } from "../../../common/vue-i18n"
import timerDatabase, { QueryParam } from "../../../database/timer-database"
import SiteInfo from "../../../entity/dto/site-info"
import timerService from "../../../service/timer-service"
import { formatTime, MILL_PER_DAY } from "../../../util/time"
import './style/filter'

const yesterday = new Date().getTime() - MILL_PER_DAY
const daysBefore = (days: number) => new Date().getTime() - days * MILL_PER_DAY

const birthdayOfBrowser = new Date()
birthdayOfBrowser.setFullYear(1994)
birthdayOfBrowser.setMonth(12 - 1)
birthdayOfBrowser.setDate(15)
const datePickerShortcut = (msg: string, days: number) => {
    return {
        text: t(`clear.dateShortcut.${msg}`),
        value: [birthdayOfBrowser, daysBefore(days)]
    }
}
const yesterdayMsg = formatTime(yesterday, '{y}/{m}/{d}')

const dateRangeRef: Ref<Array<Date>> = ref([])
const focusStartRef: Ref<string> = ref('0')
const focusEndRef: Ref<string> = ref('2')
const totalStartRef: Ref<string> = ref('0')
const totalEndRef: Ref<string> = ref('')
const timeStartRef: Ref<string> = ref('0')
const timeEndRef: Ref<string> = ref('')
/**
 * Assert query param with numberic range
 * 
 * @param range       numberic range, 2-length array
 * @param mustInteger must be integer?
 * @returns true when has error, or false
 */
const assertQueryParam = (range: number[], mustInteger?: boolean) => {
    const reg = mustInteger ? /^[0-9]+$/ : /^[0-9]+.?[0-9]*$/
    const start = range[0]
    const end = range[1]
    const noStart = start !== undefined && start !== null
    const noEnd = end !== undefined && end !== null
    return (noStart && !reg.test(start.toString()))
        || (noEnd && !reg.test(end.toString()))
        || (noStart && noEnd && start > end)
}

const generateParamAndSelect = () => {
    let hasError = false
    const str2Num = (str: Ref<string>, defaultVal?: number) => (str.value && str.value !== '') ? parseInt(str.value) : defaultVal
    const totalRange = [str2Num(totalStartRef, 0) * 1000, str2Num(totalEndRef) ? str2Num(totalEndRef) * 1000 : undefined]
    hasError = hasError || assertQueryParam(totalRange)
    const focusRange = [str2Num(focusStartRef, 0) * 1000, str2Num(focusEndRef) ? str2Num(focusEndRef) * 1000 : undefined]
    hasError = hasError || assertQueryParam(focusRange)
    const timeRange = [str2Num(timeStartRef, 0), str2Num(timeEndRef)]
    hasError = hasError || assertQueryParam(timeRange, true)
    const dateRange = dateRangeRef.value

    if (hasError) {
        ElMessage({
            message: t('clear.paramError'),
            type: 'warning'
        })
    } else {
        const param = new QueryParam()
        param.totalRange = totalRange
        param.focusRange = focusRange
        param.timeRange = timeRange
        param.date = dateRange

        return timerDatabase.select(param)
    }
}

const _default = defineComponent((_props, ctx: SetupContext) => {
    const onDateChanged = ctx.attrs.onDateChanged as () => void

    const title = h('h3', t('clear.filterItems'))
    const stepNo = 'step-no'

    const picker = () => h(ElDatePicker,
        {
            size: 'mini',
            style: 'width:250px;',
            startPlaceholder: '1994/12/15',
            endPlaceholder: yesterdayMsg,
            type: 'daterange',
            disabledDate(date: Date) { return date.getTime() > yesterday },
            shortcuts: [
                datePickerShortcut('tillYesturday', 1),
                datePickerShortcut('till7DaysAgo', 7),
                datePickerShortcut('till30DaysAgo', 30)
            ],
            rangeSeparator: '-',
            modelValue: dateRangeRef.value,
            "onUpdate:modelValue": (date: Array<Date>) => dateRangeRef.value = date
        })
    const first = () => h('p', [
        h('a', { class: stepNo }, '1.'),
        tN('clear.filterDate', { picker: picker() })
    ])

    const startAndInput = (translateKey: string, startRef: Ref<string>, endRef: Ref<string>, lineNo: number) => h('p', [
        h('a', { class: stepNo }, `${lineNo}.`),
        tN(translateKey, {
            start: h(ElInput, {
                class: 'filter-input',
                placeholder: '0',
                min: 0,
                clearable: true,
                size: 'mini',
                modelValue: startRef.value,
                onInput: (val: string) => startRef.value = val.trim(),
                onClear: () => startRef.value = ''
            }), end: h(ElInput, {
                class: 'filter-input',
                placeholder: t('clear.unlimited'),
                min: startRef.value || '0',
                clearable: true,
                size: 'mini',
                modelValue: endRef.value,
                onInput: (val: string) => endRef.value = val.trim(),
                onClear: () => endRef.value = ''
            })
        })
    ])

    const archiveButton = () => h(ElTooltip,
        { content: t('clear.archiveAlert') },
        () => h(ElButton,
            {
                icon: 'el-icon-document-add',
                type: 'primary',
                size: 'mini',
                onClick: () => {
                    generateParamAndSelect()
                        .then((result: SiteInfo[]) => {
                            const count = result.length
                            ElMessageBox.confirm(t('clear.archiveConfirm', { count }))
                                .then(() => timerService.archive(result))
                                .then(() => {
                                    ElMessage(t('clear.archiveSuccess'))
                                    onDateChanged()
                                }).catch(() => { })
                        })
                }
            },
            () => t('item.operation.archive')
        ))
    const deleteButton = () => h(ElButton,
        {
            icon: 'el-icon-delete',
            type: 'danger',
            size: 'mini',
            onClick: () => {
                generateParamAndSelect()
                    .then(result => {
                        const count = result.length
                        ElMessageBox.confirm(t('clear.deleteConfirm', { count }))
                            .then(() => timerDatabase.delete(result))
                            .then(() => {
                                ElMessage(t('clear.deleteSuccess'))
                                onDateChanged()
                            }).catch(() => { })
                    })
            }
        },
        () => t('item.operation.delete')
    )

    const footer = () => h('div', { class: 'filter-container', style: 'padding-top: 40px;' }, [archiveButton(), deleteButton()])

    return () => h('div', { style: 'text-align:left; padding-left:30px; padding-top:20px;' },
        [
            title, first(),
            startAndInput('clear.filterFocus', focusStartRef, focusEndRef, 2),
            startAndInput('clear.filterTotal', totalStartRef, totalEndRef, 3),
            startAndInput('clear.filterTime', timeStartRef, timeEndRef, 4),
            footer()
        ]
    )
})

export default _default