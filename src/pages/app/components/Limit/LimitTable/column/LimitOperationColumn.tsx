/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { t } from "@app/locale"
import { judgeVerificationRequired, processVerification } from "@app/util/limit"
import { Delete, Edit } from "@element-plus/icons-vue"
import { locale } from "@i18n"
import { type ElTableRowScope } from "@pages/element-ui/table"
import optionService from "@service/option-service"
import { ElButton, ElMessageBox, ElTableColumn } from "element-plus"
import { defineComponent } from "vue"

async function handleDelete(row: timer.limit.Item, callback: () => void) {
    let promise = undefined
    if (await judgeVerificationRequired(row)) {
        const option = await optionService.getAllOption()
        promise = processVerification(option)
    }
    if (!promise) {
        const message = t(msg => msg.limit.message.deleteConfirm, {
            cond: row.cond,
        })
        promise = ElMessageBox.confirm(message, { type: "warning" })
    }
    promise.then(callback).catch(() => {
        /** Do nothing */
    })
}

async function handleModify(row: timer.limit.Item, callback: () => void) {
    let promise: Promise<void> = undefined
    if (await judgeVerificationRequired(row)) {
        const option = (await optionService.getAllOption()) as timer.option.LimitOption
        promise = processVerification(option)
        promise ? promise.then(callback).catch(() => { }) : callback()
    } else {
        callback()
    }
}

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
                    onClick={() => handleDelete(row, () => ctx.emit("rowDelete", row))}
                >
                    {t(msg => msg.button.delete)}
                </ElButton>
                <ElButton
                    type="primary"
                    size="small"
                    icon={<Edit />}
                    onClick={() => handleModify(row, () => ctx.emit("rowModify", row))}
                >
                    {t(msg => msg.button.modify)}
                </ElButton>
            </>
            }
        />
    },
})

export default _default
