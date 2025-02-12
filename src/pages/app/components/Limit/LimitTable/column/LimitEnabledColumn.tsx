/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { judgeVerificationRequired, processVerification } from "@app/util/limit"
import { type ElTableRowScope } from "@pages/element-ui/table"
import optionHolder from "@service/components/option-holder"
import { ElSwitch, ElTableColumn } from "element-plus"
import { defineComponent, toRaw } from "vue"

async function handleChange(row: timer.limit.Item, newVal: boolean): Promise<void> {
    if (!newVal && await judgeVerificationRequired(row)) {
        // Disable limited rules, so verification is required
        const option = await optionHolder.get()
        await processVerification(option)
    }
}

const sortMethod = ({ enabled: a }: timer.limit.Item, { enabled: b }: timer.limit.Item): number => {
    return (a ? 1 : 0) - (b ? 1 : 0)
}

const _default = defineComponent({
    emits: {
        rowChange: (_row: timer.limit.Item, _val: boolean) => true
    },
    setup(_, ctx) {
        return () => (
            <ElTableColumn
                label={t(msg => msg.limit.item.enabled)}
                minWidth={100}
                align="center"
                fixed="right"
                sortable
                sortMethod={sortMethod}
            >
                {({ row }: ElTableRowScope<timer.limit.Item>) => (
                    <ElSwitch
                        size="small"
                        modelValue={row.enabled}
                        onChange={(val: boolean) => handleChange(row, val)
                            .then(() => {
                                row.enabled = val
                                ctx.emit("rowChange", toRaw(row), val)
                            })
                            .catch(console.log)
                        }
                    />
                )}
            </ElTableColumn>
        )
    }
})

export default _default