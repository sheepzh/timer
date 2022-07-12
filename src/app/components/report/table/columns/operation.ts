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
import { computed, defineComponent, h, PropType } from "vue"
import { ElButton, ElMessage, ElTableColumn } from "element-plus"
import TimerDatabase from "@db/timer-database"
import whitelistService from "@service/whitelist-service"
import { t } from "@app/locale"
import { LocationQueryRaw, Router, useRouter } from "vue-router"
import { TREND_ROUTE } from "@app/router/constants"
import { Open, Plus, Stopwatch } from "@element-plus/icons-vue"
import OperationPopupConfirmButton from "@app/components/common/popup-confirm-button"
import OperationDeleteButton from "./operation-delete-button"
import { locale } from "@util/i18n"

const timerDatabase = new TimerDatabase(chrome.storage.local)

async function handleDeleteByRange(itemHost2Delete: string, dateRange: Array<Date>): Promise<string[]> {
    // Delete all
    if (!dateRange || !dateRange.length) {
        return await timerDatabase.deleteByUrl(itemHost2Delete)
    }
    // Delete by range
    const start = dateRange[0]
    const end = dateRange[1]
    await timerDatabase.deleteByUrlBetween(itemHost2Delete, start, end)
}

const columnLabel = t(msg => msg.item.operation.label)
const trendButtonText = t(msg => msg.item.operation.jumpToTrend)

// Whitelist texts
const add2WhitelistButtonText = t(msg => msg.item.operation.add2Whitelist)
const add2WhitelistSuccessMsg = t(msg => msg.report.added2Whitelist)
const removeFromWhitelistButtonText = t(msg => msg.item.operation.removeFromWhitelist)
const removeFromWhitelistSuccessMsg = t(msg => msg.report.removeFromWhitelist)
const _default = defineComponent({
    name: "OperationColumn",
    props: {
        mergeDate: Boolean,
        mergeHost: Boolean,
        dateRange: Array as PropType<Array<Date>>,
        whitelist: Array as PropType<Array<String>>
    },
    emits: ["whitelistChange", "delete"],
    setup(props, ctx) {
        const canOperate = computed(() => !props.mergeHost)
        const width = computed(() => props.mergeHost ? 110 : locale === "zh_CN" ? 290 : 330)
        const router: Router = useRouter()
        return () => h(ElTableColumn, {
            width: width.value,
            label: columnLabel,
            align: "center"
        }, {
            default: ({ row }: { row: timer.stat.Row }) => [
                // Trend
                h(ElButton, {
                    icon: Stopwatch,
                    size: 'small',
                    type: 'primary',
                    onClick() {
                        const query: LocationQueryRaw = {
                            host: row.host,
                            merge: props.mergeHost ? '1' : '0',
                        }
                        router.push({ path: TREND_ROUTE, query })
                    }
                }, () => trendButtonText),
                // Delete button
                h(OperationDeleteButton, {
                    mergeDate: props.mergeDate,
                    itemUrl: row.host,
                    itemDate: row.date,
                    dateRange: props.dateRange,
                    visible: canOperate.value,
                    async onConfirm() {
                        const host = row.host
                        props.mergeDate
                            ? await handleDeleteByRange(host, props.dateRange)
                            : await timerDatabase.deleteByUrlAndDate(host, row.date)
                        ctx.emit("delete", row)
                    }
                }),
                // Add 2 whitelist
                h(OperationPopupConfirmButton, {
                    buttonIcon: Plus,
                    buttonType: "warning",
                    buttonText: add2WhitelistButtonText,
                    confirmText: t(msg => msg.whitelist.addConfirmMsg, { url: row.host }),
                    visible: canOperate.value && !props.whitelist?.includes(row.host),
                    async onConfirm() {
                        await whitelistService.add(row.host)
                        ElMessage({ message: add2WhitelistSuccessMsg, type: 'success' })
                        ctx.emit("whitelistChange", row.host, true)
                    }
                }),
                // Remove from whitelist
                h(OperationPopupConfirmButton, {
                    buttonIcon: Open,
                    buttonType: "primary",
                    buttonText: removeFromWhitelistButtonText,
                    confirmText: t(msg => msg.whitelist.removeConfirmMsg, { url: row.host }),
                    visible: canOperate.value && props.whitelist?.includes(row.host),
                    async onConfirm() {
                        await whitelistService.remove(row.host)
                        ElMessage({ message: removeFromWhitelistSuccessMsg, type: 'success' })
                        ctx.emit("whitelistChange", row.host, false)
                    }
                })
            ]
        })
    }
})

export default _default