import { ElButton, ElMessage, ElMessageBox, ElTooltip } from "element-plus"
import _Button from "element-plus/lib/el-button"
import { Ref, h } from "vue"
import TimerDatabase, { TimerCondition } from "../../../../../database/timer-database"
import SiteInfo from "../../../../../entity/dto/site-info"
import { ItemMessage } from "../../../../../util/i18n/components/item"
import { t } from "../../../../locale"
import { DataManageMessage } from "../../../../locale/components/data-manage"

const timerDatabase = new TimerDatabase(chrome.storage.local)

export type BaseFilterProps = {
    totalStartRef: Ref<string>
    totalEndRef: Ref<string>
    focusStartRef: Ref<string>
    focusEndRef: Ref<string>
    timeStartRef: Ref<string>
    timeEndRef: Ref<string>
    dateRangeRef: Ref<Date[]>
}


type _Props = BaseFilterProps & {
    onDateChanged: () => void

    confirm: {
        message: keyof DataManageMessage
        operation: (result: SiteInfo[]) => Promise<any>
        resultMessage: keyof DataManageMessage
    }

    button: {
        icon: string
        type: string
        message: keyof ItemMessage['operation']
    }

    tooltipMessage?: keyof DataManageMessage
}

export type OperationButtonProps = _Props

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

const str2Num = (str: Ref<string>, defaultVal?: number) => (str.value && str.value !== '') ? parseInt(str.value) : defaultVal

const str2Range = (startAndEnd: Ref<string>[], numAmplifier?: (origin: number) => number) => {
    const startStr = startAndEnd[0]
    const endStr = startAndEnd[1]
    let start = str2Num(startStr, 0)
    numAmplifier && (start = numAmplifier(start))
    let end = str2Num(endStr)
    end && numAmplifier && (end = numAmplifier(end))
    return [start, end]
}

const seconds2MillSeconds = (a: number) => a * 1000

const generateParamAndSelect = (props: _Props) => {
    const { totalStartRef, totalEndRef, focusStartRef, focusEndRef, timeStartRef, timeEndRef, dateRangeRef } = props
    let hasError = false
    const totalRange = str2Range([totalStartRef, totalEndRef], seconds2MillSeconds)
    hasError = hasError || assertQueryParam(totalRange)
    const focusRange = str2Range([focusStartRef, focusEndRef], seconds2MillSeconds)
    hasError = hasError || assertQueryParam(focusRange)
    const timeRange = str2Range([timeStartRef, timeEndRef])
    hasError = hasError || assertQueryParam(timeRange, true)
    const dateRange = dateRangeRef.value

    if (hasError) {
        ElMessage({ message: t(msg => msg.dataManage.paramError), type: 'warning' })
        return
    }

    const condition: TimerCondition = {}
    condition.totalRange = totalRange
    condition.focusRange = focusRange
    condition.timeRange = timeRange
    condition.date = dateRange

    return timerDatabase.select(condition)
}

const handleClick = async (props: _Props) => {
    const result: SiteInfo[] = await generateParamAndSelect(props)

    const count = result.length
    ElMessageBox.confirm(t(msg => msg.dataManage[props.confirm.message], { count }))
        .then(async () => {
            await props.confirm.operation(result)
            ElMessage(t(msg => msg.dataManage[props.confirm.resultMessage]))
            props.onDateChanged()
        }).catch(() => { })
}

const button = (props: _Props) => h(ElButton,
    {
        icon: `el-icon-${props.button.icon}`,
        type: props.button.type,
        size: 'mini',
        onClick: () => handleClick(props)
    },
    () => t(msg => msg.item.operation[props.button.message])
)

const buttonWithTooltip = (props: _Props) => h(ElTooltip,
    { content: t(msg => msg.dataManage[props.tooltipMessage]) },
    () => button(props)
)

const operationButton = (props: _Props) => props.tooltipMessage ? buttonWithTooltip(props) : button(props)

export default operationButton