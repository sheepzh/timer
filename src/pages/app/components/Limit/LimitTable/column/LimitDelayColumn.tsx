/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import ColumnHeader from "@app/components/common/ColumnHeader"
import { t } from "@app/locale"
import { judgeVerificationRequired, processVerification } from "@app/util/limit"
import { type ElTableRowScope } from "@pages/element-ui/table"
import optionHolder from "@service/components/option-holder"
import { ElSwitch, ElTableColumn } from "element-plus"
import { defineComponent, toRaw } from "vue"

async function handleChange(row: timer.limit.Item, newVal: boolean): Promise<void> {
    if (newVal && await judgeVerificationRequired(row)) {
        // Open delay for limited rules, so verification is required
        const option = await optionHolder.get()
        await processVerification(option)
    }
}

const _default = defineComponent({
    emits: {
        rowChange: (_row: timer.limit.Item, _val: boolean) => true,
    },
    setup(_, ctx) {
        return () => (
            <ElTableColumn
                minWidth={100}
                align="center"
                v-slots={{
                    header: () => <ColumnHeader
                        label={t(msg => msg.limit.item.delayAllowed)}
                        tooltipContent={t(msg => msg.limit.item.delayAllowedInfo)}
                    />,
                    default: ({ row }: ElTableRowScope<timer.limit.Item>) => <ElSwitch
                        modelValue={row.allowDelay}
                        onChange={(val: boolean) => handleChange(row, val)
                            .then(() => {
                                row.allowDelay = val
                                ctx.emit("rowChange", toRaw(row), val)
                            })
                            .catch(console.log)
                        }
                    />,
                }}
            />
        )
    }
})

export default _default
