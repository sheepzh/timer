/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { t } from "@app/locale"
import { Delete, Edit } from "@element-plus/icons-vue"
import { locale } from "@i18n"
import { type ElTableRowScope } from "@pages/element-ui/table"
import { ElButton, ElMessageBox, ElTableColumn } from "element-plus"
import { defineComponent } from "vue"
import { verifyCanModify } from "../../common"

const LOCALE_WIDTH: { [locale in timer.Locale]: number } = {
    en: 220,
    zh_CN: 200,
    ja: 200,
    zh_TW: 200,
    pt_PT: 250,
    uk: 260,
    es: 240,
    de: 250,
    fr: 230,
    ru: 240,
    ar: 220,
}

const _default = defineComponent({
    emits: {
        rowDelete: (_row: timer.limit.Item) => true,
        rowModify: (_row: timer.limit.Item) => true,
    },
    setup(_props, ctx) {
        const handleDelete = (row: timer.limit.Item) => verifyCanModify(row)
            .then(() => {
                const message = t(msg => msg.limit.message.deleteConfirm, { cond: row?.cond })
                return ElMessageBox.confirm(message, { type: "warning" })
            })
            .then(() => ctx.emit('rowDelete', row))
            .catch(() => {/** Do nothing */ })

        const handleModify = (row: timer.limit.Item) => verifyCanModify(row)
            .then(() => ctx.emit("rowModify", row))
            .catch(() => {/** Do nothing */ })

        return () => <ElTableColumn
            prop="operations"
            label={t(msg => msg.button.operation)}
            width={LOCALE_WIDTH[locale]}
            align="center"
            fixed="right"
            v-slots={({ row }: ElTableRowScope<timer.limit.Item>) => <>
                <ElButton
                    type="danger"
                    size="small"
                    icon={<Delete />}
                    onClick={() => handleDelete(row)}
                >
                    {t(msg => msg.button.delete)}
                </ElButton>
                <ElButton
                    type="primary"
                    size="small"
                    icon={<Edit />}
                    onClick={() => handleModify(row)}
                >
                    {t(msg => msg.button.modify)}
                </ElButton>
            </>
            }
        />
    },
})

export default _default
