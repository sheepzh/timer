/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * Generate operation buttons
 * 
 * @todo !!!! Remaining code of optimizing performance
 */
import { h, ref, Ref } from "vue"
import { ElButton, ElMessage, ElTableColumn } from "element-plus"
import DataItem from "@entity/dto/data-item"
import TimerDatabase from "@db/timer-database"
import whitelistService from "@service/whitelist-service"
import { formatTime } from "@util/time"
import { t } from "@app/locale"
import { ReportMessage } from "@app/locale/components/report"
import { QueryData } from "@app/components/common/constants"
import { LocationQueryRaw, Router } from "vue-router"
import { TREND_ROUTE } from "@app/router/constants"
import { dateFormatter } from "../../formatter"

import { Delete, Open, Plus, Stopwatch } from "@element-plus/icons"
import OperationPopupConfirmButton from "./operation-popup-confirm-button"

const timerDatabase = new TimerDatabase(chrome.storage.local)

const deleteMsgRef: Ref<string> = ref('')
const DISPLAY_DATE_FORMAT = '{y}/{m}/{d}'

type Props = {
    queryWhiteList: () => Promise<void>
    queryData: QueryData
    whitelistRef: Ref<string[]>
    mergeDateRef: Ref<boolean>
    mergeHostRef: Ref<boolean>
    dateRangeRef: Ref<Array<Date>>
    router: Router
}

export type OperationButtonColumnProps = Props

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
    const hasDateRange = dateRange?.length
    // Delete all
    if (!hasDateRange) return deleteMsgRef.value = t(msg => msg.item.operation.deleteConfirmMsgAll, { url: host })

    const start = dateRange[0]
    const end = dateRange[1]
    let msg = t(msg => msg.item.operation.deleteConfirmMsgRange,
        { url: host, start: formatTime(start, DISPLAY_DATE_FORMAT), end: formatTime(end, DISPLAY_DATE_FORMAT) }
    )
    deleteMsgRef.value = msg
}

const deleteButtonText = t(msg => msg.item.operation.delete)
const deleteButton = (props: Props, row: DataItem) => h(OperationPopupConfirmButton, {
    buttonIcon: Delete,
    buttonType: "warning",
    buttonText: deleteButtonText,
    confirmText: deleteMsgRef.value,
    onConfirm: () => deleteConfirm(props, row.host, row.date),
    onReferenceClick: () => changeDeleteConfirmUrl(props, row.host, row.date)
})

const operateTheWhitelist = async (operation: Promise<any>, props: Props, successMsg: keyof ReportMessage) => {
    await operation
    await props.queryWhiteList()
    ElMessage({ message: t(msg => msg.report[successMsg]), type: 'success' })
}

// add 2 whitelist
const add2WhitelistButtonText = t(msg => msg.item.operation.add2Whitelist)
const add2WhitelistButton = (props: Props, { host }: DataItem) => h(OperationPopupConfirmButton, {
    buttonIcon: Plus,
    buttonType: "danger",
    buttonText: add2WhitelistButtonText,
    confirmText: t(msg => msg.whitelist.addConfirmMsg, { url: host }),
    onConfirm: () => operateTheWhitelist(whitelistService.add(host), props, 'added2Whitelist')
})

// Remove from whitelist
const removeFromWhitelistButtonText = t(msg => msg.item.operation.removeFromWhitelist)
const removeFromWhitelistButton = (props: Props, { host }: DataItem) => h(OperationPopupConfirmButton, {
    buttonIcon: Open,
    buttonType: "primary",
    buttonText: removeFromWhitelistButtonText,
    confirmText: t(msg => msg.whitelist.removeConfirmMsg, { url: host }),
    onConfirm: () => operateTheWhitelist(whitelistService.remove(host), props, 'removeFromWhitelist')
})

function handleClickJump(props: Props, { host }: DataItem) {
    const query: LocationQueryRaw = {
        host,
        merge: props.mergeHostRef.value ? '1' : '0',
    }
    props.router.push({ path: TREND_ROUTE, query })
}

// Jump to the trend
const jumpTowardTheTrend = (props: Props, row: DataItem) => h<{}>(ElButton, {
    icon: Stopwatch,
    size: 'mini',
    type: 'primary',
    onClick: () => handleClickJump(props, row)
}, () => t(msg => msg.item.operation.jumpToTrend))

const operationContainer = (props: Props, row: DataItem) => {
    const operationButtons = []
    const { host } = row
    operationButtons.push(jumpTowardTheTrend(props, row))
    if (!props.mergeHostRef.value) {
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
    { minWidth: props.mergeHostRef.value ? 100 : 280, ...tableColumnProps },
    {
        default: (data: { row: DataItem }) => operationContainer(props, data.row)
    }
)

export default _default