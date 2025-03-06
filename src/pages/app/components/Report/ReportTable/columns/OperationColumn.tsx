/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { type AnalysisQuery } from "@app/components/Analysis/common"
import PopupConfirmButton from "@app/components/common/PopupConfirmButton"
import { t } from "@app/locale"
import { ANALYSIS_ROUTE } from "@app/router/constants"
import { Delete, Open, Plus, Stopwatch } from "@element-plus/icons-vue"
import { useRequest } from "@hooks"
import { locale } from "@i18n"
import { type ElTableRowScope } from "@pages/element-ui/table"
import whitelistService from "@service/whitelist-service"
import { CATE_NOT_SET_ID } from "@util/site"
import { ElButton, ElMessage, ElTableColumn } from "element-plus"
import { computed, defineComponent } from "vue"
import { useRouter } from "vue-router"
import { computeDeleteConfirmMsg, handleDelete } from "../../common"
import { useReportFilter } from "../../context"

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
    ru: 350,
    ar: 320,
}

const _default = defineComponent({
    emits: {
        delete: (_row: timer.stat.Row) => true,
    },
    setup(_, ctx) {
        const filter = useReportFilter()
        const canOperate = computed(() => !filter.value?.siteMerge)
        const width = computed(() => canOperate.value ? LOCALE_WIDTH[locale] : 110)
        const router = useRouter()
        const {
            data: whitelist,
            refresh: refreshWhitelist,
        } = useRequest(() => whitelistService.listAll(), { defaultValue: [] })

        const jump2Analysis = (row: timer.stat.Row) => {
            let query: AnalysisQuery
            const siteMerge = filter.value?.siteMerge
            if (siteMerge === 'cate') {
                query = { cateId: row?.cateKey?.toString?.() }
            } else {
                query = { ...row.siteKey }
            }
            router.push({ path: ANALYSIS_ROUTE, query })
        }

        return () => (
            <ElTableColumn
                width={width.value}
                label={t(msg => msg.button.operation)}
                align="center"
            >
                {({ row }: ElTableRowScope<timer.stat.Row>) => <>
                    {/* Analysis */}
                    {row.cateKey !== CATE_NOT_SET_ID && (
                        <ElButton
                            icon={<Stopwatch />}
                            size="small"
                            type="primary"
                            onClick={() => jump2Analysis(row)}
                        >
                            {t(msg => msg.item.operation.analysis)}
                        </ElButton>
                    )}
                    {/* Delete button */}
                    <PopupConfirmButton
                        buttonIcon={<Delete />}
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
                        buttonIcon={<Plus />}
                        buttonType="warning"
                        buttonText={t(msg => msg.item.operation.add2Whitelist)}
                        confirmText={t(msg => msg.whitelist.addConfirmMsg, { url: row.siteKey?.host })}
                        visible={canOperate.value && !whitelist.value?.includes(row.siteKey?.host)}
                        onConfirm={async () => {
                            await whitelistService.add(row.siteKey?.host)
                            refreshWhitelist()
                            ElMessage.success(t(msg => msg.operation.successMsg))
                        }}
                    />
                    {/* Remove from whitelist */}
                    <PopupConfirmButton
                        buttonIcon={<Open />}
                        buttonType="primary"
                        buttonText={t(msg => msg.item.operation.removeFromWhitelist)}
                        confirmText={t(msg => msg.whitelist.removeConfirmMsg, { url: row.siteKey?.host })}
                        visible={canOperate.value && whitelist.value?.includes(row.siteKey?.host)}
                        onConfirm={async () => {
                            await whitelistService.remove(row.siteKey?.host)
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
