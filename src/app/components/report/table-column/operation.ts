/**
 * Generate operation buttons
 */
import { h, ref, Ref } from 'vue'
import { ElButton, ElMessage, ElPopconfirm, ElTableColumn } from "element-plus"
import { ItemMessage } from "../../../../util/i18n/components/item"
import { t } from "../../../locale"
import SiteInfo from '../../../../entity/dto/site-info'
import TimerDatabase from '../../../../database/timer-database'
import whitelistService from '../../../../service/whitelist-service'
import { formatTime } from '../../../../util/time'
import { dateFormatter } from '../formatter'
import { ReportMessage } from '../../../locale/components/report'
import { QueryData } from '../../common/constants'
import { LocationQueryRaw, Router } from 'vue-router'
import { TREND_ROUTE } from '../../../router/constants'

const timerDatabase = new TimerDatabase(chrome.storage.local)

const deleteMsgRef: Ref<string> = ref('')
const DISPLAY_DATE_FORMAT = '{y}/{m}/{d}'

type Props = {
    queryWhiteList: () => Promise<void>
    queryData: QueryData
    whitelistRef: Ref<string[]>
    mergeDateRef: Ref<boolean>
    mergeDomainRef: Ref<boolean>
    dateRangeRef: Ref<Array<Date>>
    router: Router
}

export type OperationButtonColumnProps = Props

// Generate operationButton
type OperationButtonProps = {
    confirmTitle: string
    buttonType: string
    buttonIcon: string
    buttonMessage: keyof ItemMessage['operation']
    onConfirm: () => void
    onClick?: () => void
}
const operationButton = (props: OperationButtonProps) => {
    const popConfirmProps = {
        confirmButtonText: t(msg => msg.item.operation.confirmMsg),
        cancelButtonText: t(msg => msg.item.operation.cancelMsg),
        title: props.confirmTitle,
        onConfirm: props.onConfirm
    }
    const reference = () => h(ElButton, {
        size: 'mini',
        type: props.buttonType,
        onClick: props.onClick,
        icon: `el-icon-${props.buttonIcon}`
    }, () => t(msg => msg.item.operation[props.buttonMessage]))
    return h(ElPopconfirm, popConfirmProps, { reference })
}
// Delete button
const deleteOneRow = async (props: Props, host: string, date: string | Date) => {
    // Delete by date
    if (!props.mergeDateRef.value) return await timerDatabase.deleteByUrlAndDate(host, date)
    const dateRange = props.dateRangeRef.value
    // Delete all
    if (!dateRange || !dateRange.length) return await timerDatabase.deleteByUrl(host)
    // Delete by range
    const start = dateRange[0]
    const end = dateRange[1]
    await timerDatabase.deleteByUrlBetween(host, start, end)
}

const deleteConfirm = async (props: Props, host: string, date: string | Date) => {
    await deleteOneRow(props, host, date)
    props.queryData()
}

const changeDeleteConfirmUrl = (props: Props, host: string, date: string) => {
    const dateRange = props.dateRangeRef.value
    // Not merge, delete one item
    if (!props.mergeDateRef.value) {
        const msg = t(msg => msg.item.operation.deleteConfirmMsg, { url: host, date: dateFormatter(date) })
        deleteMsgRef.value = msg
        return
    }
    // Delete all
    if (!dateRange.length) return deleteMsgRef.value = t(msg => msg.item.operation.deleteConfirmMsgAll, { url: host })

    const start = dateRange[0]
    const end = dateRange[1]
    let msg = t(msg => msg.item.operation.deleteConfirmMsgRange,
        { url: host, start: formatTime(start, DISPLAY_DATE_FORMAT), end: formatTime(end, DISPLAY_DATE_FORMAT) }
    )
    deleteMsgRef.value = msg
}

const deleteButton = (props: Props, row: SiteInfo) => operationButton(
    {
        buttonType: 'warning',
        buttonIcon: 'delete',
        buttonMessage: 'delete',
        confirmTitle: deleteMsgRef.value,
        onConfirm: () => deleteConfirm(props, row.host, row.date),
        onClick: () => changeDeleteConfirmUrl(props, row.host, row.date)
    }
)

const operateTheWhitelist = async (operation: Promise<any>, props: Props, successMsg: keyof ReportMessage) => {
    await operation
    await props.queryWhiteList()
    ElMessage({ message: t(msg => msg.report[successMsg]), type: 'success' })
}

// add 2 whitelist
const add2WhitelistButton = (props: Props, { host }: SiteInfo) => operationButton({
    confirmTitle: t(msg => msg.additional.whitelist.addConfirmMsg, { url: host }),
    buttonType: 'danger',
    buttonIcon: 'plus',
    buttonMessage: 'add2Whitelist',
    onConfirm: () => operateTheWhitelist(whitelistService.add(host), props, 'added2Whitelist')
})

// Remove from whitelist
const removeFromWhitelistButton = (props: Props, { host }: SiteInfo) => operationButton({
    confirmTitle: t(msg => msg.additional.whitelist.removeConfirmMsg, { url: host }),
    buttonType: 'primary',
    buttonIcon: 'open',
    buttonMessage: 'removeFromWhitelist',
    onConfirm: () => operateTheWhitelist(whitelistService.remove(host), props, 'removeFromWhitelist')
})

function handleClickJump(props: Props, { host }: SiteInfo) {
    const query: LocationQueryRaw = {
        host,
        merge: props.mergeDomainRef.value ? '1' : '0',
    }
    props.router.push({ path: TREND_ROUTE, query })
}

// Jump to the trend
const jumpTowardTheTrend = (props: Props, row: SiteInfo) => h(ElButton, {
    icon: 'el-icon-stopwatch',
    size: 'mini',
    type: 'primary',
    onClick: () => handleClickJump(props, row)
}, () => t(msg => msg.item.operation.jumpToTrend))

const operationContainer = (props: Props, row: SiteInfo) => {
    const operationButtons = []
    const { host } = row
    operationButtons.push(jumpTowardTheTrend(props, row))
    if (!props.mergeDomainRef.value) {
        // Delete button 
        operationButtons.push(deleteButton(props, row))

        const existsInWhitelist = props.whitelistRef.value.includes(host)
        const whitelistButton = existsInWhitelist ? removeFromWhitelistButton(props, row) : add2WhitelistButton(props, row)
        operationButtons.push(whitelistButton)
    }
    return operationButtons
}

const tableColumnProps = {
    label: t(msg => msg.item.operation.label),
    align: 'center',
    fixed: 'right'
}
const _default = (props: Props) => h(ElTableColumn,
    { minWidth: props.mergeDomainRef.value ? 100 : 280, ...tableColumnProps },
    {
        default: (data: { row: SiteInfo }) => operationContainer(props, data.row)
    }
)

export default _default