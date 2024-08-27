/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { computed, defineComponent } from "vue"
import { ElButton, ElMessage, ElTableColumn } from "element-plus"
import whitelistService from "@service/whitelist-service"
import { t } from "@app/locale"
import { LocationQueryRaw, useRouter } from "vue-router"
import { ANALYSIS_ROUTE } from "@app/router/constants"
import { Delete, Open, Plus, Stopwatch } from "@element-plus/icons-vue"
import PopupConfirmButton from "@app/components/common/PopupConfirmButton"
import { useReportFilter } from "../../context"
import { ElTableRowScope } from "@src/element-ui/table"
import { locale } from "@i18n"
import { computeDeleteConfirmMsg, handleDelete } from "../../common"
import { useRequest } from "@hooks/useRequest"

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
        const {
            data: whitelist,
            refresh: refreshWhitelist,
        } = useRequest(() => whitelistService.listAll(), { defaultValue: [] })

        const jump2Analysis = (host: string) => {
            const query: LocationQueryRaw = {
                host,
                merge: filter.value?.mergeHost ? '1' : '0',
            }
            router.push({ path: ANALYSIS_ROUTE, query })
        }

        return () => (
            <ElTableColumn
                width={width.value}
                label={t(msg => msg.item.operation.label)}
                align="center"
            >
                {({ row }: ElTableRowScope<timer.stat.Row>) => <>
                    {/* Analysis */}
                    <ElButton
                        icon={<Stopwatch />}
                        size="small"
                        type="primary"
                        onClick={() => jump2Analysis(row.host)}
                    >
                        {t(msg => msg.item.operation.analysis)}
                    </ElButton>
                    {/* Delete button */}
                    <PopupConfirmButton
                        buttonIcon={Delete}
                        buttonType="danger"
                        buttonText={t(msg => msg.button.delete)}
                        confirmText={computeDeleteConfirmMsg(row, filter.value)}
                        visible={canOperate.value}
                        onConfirm={async () => {
                            await handleDelete(row, filter.value)
                            ctx.emit("delete", row)
                        }}
                    />
                    {/* Add 2 whitelist */}
                    <PopupConfirmButton
                        buttonIcon={Plus}
                        buttonType="warning"
                        buttonText={t(msg => msg.item.operation.add2Whitelist)}
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
                        buttonText={t(msg => msg.item.operation.removeFromWhitelist)}
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
