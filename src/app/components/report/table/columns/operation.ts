/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

/**
 * Generate operation buttons
 */
import type { PropType } from "vue"

import { computed, defineComponent, h } from "vue"
import { ElButton, ElMessage, ElTableColumn } from "element-plus"
import StatDatabase from "@db/stat-database"
import whitelistService from "@service/whitelist-service"
import { t } from "@app/locale"
import { LocationQueryRaw, Router, useRouter } from "vue-router"
import { ANALYSIS_ROUTE } from "@app/router/constants"
import { Open, Plus, Stopwatch } from "@element-plus/icons-vue"
import OperationPopupConfirmButton from "@app/components/common/popup-confirm-button"
import OperationDeleteButton from "./operation-delete-button"
import { locale } from "@i18n"

const statDatabase = new StatDatabase(chrome.storage.local)

async function handleDeleteByRange(itemHost2Delete: string, dateRange: Array<Date>): Promise<string[]> {
    // Delete all
    if (!dateRange || !dateRange.length) {
        return await statDatabase.deleteByUrl(itemHost2Delete)
    }
    // Delete by range
    const start = dateRange[0]
    const end = dateRange[1]
    await statDatabase.deleteByUrlBetween(itemHost2Delete, start, end)
}

const COL_LABEL = t(msg => msg.item.operation.label)
const ANALYSIS = t(msg => msg.item.operation.analysis)
// Whitelist texts
const ADD_WHITE = t(msg => msg.item.operation.add2Whitelist)
const ADD_WHITE_SUCC = t(msg => msg.report.added2Whitelist)
const REMOVE_WHITE = t(msg => msg.item.operation.removeFromWhitelist)
const REMOVE_WHITE_SUCC = t(msg => msg.report.removeFromWhitelist)

const LOCALE_WIDTH: { [locale in timer.Locale]: number } = {
    en: 330,
    zh_CN: 290,
    ja: 360,
    zh_TW: 290,
    pt_PT: 340,
}
const _default = defineComponent({
    name: "OperationColumn",
    props: {
        mergeDate: Boolean,
        mergeHost: Boolean,
        dateRange: Array as PropType<Array<Date>>,
        whitelist: Array as PropType<Array<String>>
    },
    emits: {
        whitelistChange: (_host: string, _isWhite: boolean) => true,
        delete: (_row: timer.stat.Row) => true,
    },
    setup(props, ctx) {
        const canOperate = computed(() => !props.mergeHost)
        const width = computed(() => props.mergeHost ? 110 : LOCALE_WIDTH[locale])
        const router: Router = useRouter()
        return () => h(ElTableColumn, {
            width: width.value,
            label: COL_LABEL,
            align: "center"
        }, {
            default: ({ row }: { row: timer.stat.Row }) => [
                // Analysis
                h(ElButton, {
                    icon: Stopwatch,
                    size: 'small',
                    type: 'primary',
                    onClick() {
                        const query: LocationQueryRaw = {
                            host: row.host,
                            merge: props.mergeHost ? '1' : '0',
                        }
                        router.push({ path: ANALYSIS_ROUTE, query })
                    }
                }, () => ANALYSIS),
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
                            : await statDatabase.deleteByUrlAndDate(host, row.date)
                        ctx.emit("delete", row)
                    }
                }),
                // Add 2 whitelist
                h(OperationPopupConfirmButton, {
                    buttonIcon: Plus,
                    buttonType: "warning",
                    buttonText: ADD_WHITE,
                    confirmText: t(msg => msg.whitelist.addConfirmMsg, { url: row.host }),
                    visible: canOperate.value && !props.whitelist?.includes(row.host),
                    async onConfirm() {
                        await whitelistService.add(row.host)
                        ElMessage({ message: ADD_WHITE_SUCC, type: 'success' })
                        ctx.emit("whitelistChange", row.host, true)
                    }
                }),
                // Remove from whitelist
                h(OperationPopupConfirmButton, {
                    buttonIcon: Open,
                    buttonType: "primary",
                    buttonText: REMOVE_WHITE,
                    confirmText: t(msg => msg.whitelist.removeConfirmMsg, { url: row.host }),
                    visible: canOperate.value && props.whitelist?.includes(row.host),
                    async onConfirm() {
                        await whitelistService.remove(row.host)
                        ElMessage({ message: REMOVE_WHITE_SUCC, type: 'success' })
                        ctx.emit("whitelistChange", row.host, false)
                    }
                })
            ]
        })
    }
})

export default _default