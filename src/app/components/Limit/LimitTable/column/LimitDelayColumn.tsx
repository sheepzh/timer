/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { InfoFilled } from "@element-plus/icons-vue"
import { ElIcon, ElSwitch, ElTableColumn, ElTooltip } from "element-plus"
import { defineComponent, toRaw } from "vue"
import { t } from "@app/locale"
import optionService from "@service/option-service"
import { ElTableRowScope } from "@src/element-ui/table"
import { judgeVerificationRequired, processVerification } from "@app/util/limit"

const label = t(msg => msg.limit.item.delayAllowed)
const tooltip = t(msg => msg.limit.item.delayAllowedInfo)

async function handleChange(row: timer.limit.Item, newVal: boolean): Promise<void> {
    if (newVal && await judgeVerificationRequired(row)) {
        // Open delay for limited rules, so verification is required
        const option = await optionService.getAllOption()
        await processVerification(option)
    }
}

const _default = defineComponent({
    emits: {
        rowChange: (_row: timer.limit.Rule, _val: boolean) => true,
    },
    setup(_, ctx) {
        return () => (
            <ElTableColumn
                minWidth={80}
                align="center"
                v-slots={{
                    header: () => <div>
                        {`${label} `}
                        <ElTooltip content={tooltip} placement="top">
                            <ElIcon size={14} style={{ paddingLeft: '4px' }}>
                                <InfoFilled />
                            </ElIcon>
                        </ElTooltip>
                    </div>,
                    default: ({ row }: ElTableRowScope<timer.limit.Item>) => <ElSwitch
                        modelValue={row.allowDelay}
                        onChange={
                            (val: boolean) => handleChange(row, val)
                                .then(() => {
                                    row.allowDelay = val
                                    ctx.emit("rowChange", toRaw(row), val)
                                })
                                .catch(console.log)
                        }
                    />
                }}
            />
        )
    }
})

export default _default
