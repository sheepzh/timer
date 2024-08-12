/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { computed, defineComponent, onMounted, ref } from "vue"
import { ElButton, ElMessage, ElTableColumn } from "element-plus"
import StatDatabase from "@db/stat-database"
import whitelistService from "@service/whitelist-service"
import { t } from "@app/locale"
import { LocationQueryRaw, useRouter } from "vue-router"
import { ANALYSIS_ROUTE } from "@app/router/constants"
import { Open, Plus, Stopwatch } from "@element-plus/icons-vue"
import PopupConfirmButton from "@app/components/common/PopupConfirmButton"
import OperationDeleteButton from "./OperationDeleteButton"
import { useReportFilter } from "../../context"
import { ElTableRowScope } from "@src/element-ui/table"
import { locale } from "@i18n"

const statDatabase = new StatDatabase(chrome.storage.local)

async function handleDeleteByRange(itemHost2Delete: string, dateRange: [Date, Date]): Promise<string[]> {
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
const REMOVE_WHITE = t(msg => msg.item.operation.removeFromWhitelist)

const LOCALE_WIDTH: { [locale in timer.Locale]: number } = {
    en: 330,
    zh_CN: 290,
    ja: 360,
    zh_TW: 290,
    pt_PT: 340,
    uk: 400,
    es: 360,
    de: 370,
    fr: 330,
}
const _default = defineComponent({
    emits: {
        delete: (_row: timer.stat.Row) => true,
    },
    setup(_, ctx) {
        const filter = useReportFilter()
        const canOperate = computed(() => !filter.value?.mergeHost)
        const width = computed(() => canOperate.value ? LOCALE_WIDTH[locale] : 110)
        const router = useRouter()
        const whitelist = ref<string[]>([])
        const refreshWhitelist = () => whitelistService.listAll().then(val => whitelist.value = val)
        onMounted(refreshWhitelist)

        const jump2Analysis = (host: string) => {
            const query: LocationQueryRaw = {
                host,
                merge: filter.value?.mergeHost ? '1' : '0',
            }
            router.push({ path: ANALYSIS_ROUTE, query })
        }
        return () => (
            <ElTableColumn width={width.value} label={COL_LABEL} align="center">
                {({ row }: ElTableRowScope<timer.stat.Row>) => <>
                    {/* Analysis */}
                    <ElButton
                        icon={<Stopwatch />}
                        size="small"
                        type="primary"
                        onClick={() => jump2Analysis(row.host)}
                    >
                        {ANALYSIS}
                    </ElButton>
                    {/* Delete button */}
                    <OperationDeleteButton
                        itemUrl={row.host}
                        itemDate={row.date}
                        visible={canOperate.value}
                        onConfirm={async () => {
                            const host = row.host
                            filter.value?.mergeDate
                                ? await handleDeleteByRange(host, filter.value?.dateRange)
                                : await statDatabase.deleteByUrlAndDate(host, row.date)
                            ctx.emit("delete", row)
                        }}
                    />
                    {/* Add 2 whitelist */}
                    <PopupConfirmButton
                        buttonIcon={Plus}
                        buttonType="warning"
                        buttonText={ADD_WHITE}
                        confirmText={t(msg => msg.whitelist.addConfirmMsg, { url: row.host })}
                        visible={canOperate.value && !whitelist.value?.includes(row.host)}
                        onConfirm={async () => {
                            await whitelistService.add(row.host)
                            refreshWhitelist()
                            ElMessage.success(t(msg => msg.operation.successMsg))
                        }}
                    />
                    {/* Remove from whitelist */}
                    <PopupConfirmButton
                        buttonIcon={Open}
                        buttonType="primary"
                        buttonText={REMOVE_WHITE}
                        confirmText={t(msg => msg.whitelist.removeConfirmMsg, { url: row.host })}
                        visible={canOperate.value && whitelist.value?.includes(row.host)}
                        onConfirm={async () => {
                            await whitelistService.remove(row.host)
                            refreshWhitelist()
                            ElMessage.success(t(msg => msg.operation.successMsg))
                        }}
                    />
                </>}
            </ElTableColumn>
        )
    }
})

export default _default
