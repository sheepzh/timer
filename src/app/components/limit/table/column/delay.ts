/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { InfoFilled } from "@element-plus/icons-vue"
import { ElIcon, ElSwitch, ElTableColumn, ElTooltip } from "element-plus"
import { defineComponent, h } from "vue"
import { t } from "@app/locale"
import { judgeVerificationRequired, processVerification } from "./common"
import optionService from "@service/option-service"

const label = t(msg => msg.limit.item.delayAllowed)
const tooltip = t(msg => msg.limit.item.delayAllowedInfo)

async function handleChange(row: timer.limit.Item, newVal: boolean, callback: () => void) {
    let promise: Promise<void> = null
    if (newVal && judgeVerificationRequired(row)) {
        // Open delay for limited rules, so verification is required
        const option = await optionService.getAllOption()
        promise = processVerification(option)
    }
    promise
        ? promise.then(callback).catch(() => { })
        : callback()
}

const _default = defineComponent({
    name: "LimitDelayColumn",
    emits: {
        rowChange: (_row: timer.limit.Rule, _val: boolean) => true,
    },
    setup(_, ctx) {
        return () => h(ElTableColumn, {
            prop: 'delayClosed',
            minWidth: 80,
            align: 'center',
        }, {
            default: ({ row }: { row: timer.limit.Item }) => h(ElSwitch, {
                modelValue: row.allowDelay,
                onChange: (val: boolean) => handleChange(row, val, () => {
                    row.allowDelay = val
                    ctx.emit("rowChange", row, val)
                })
            }),
            header: () => h('div', [
                label,
                ' ',
                h(ElTooltip, {
                    content: tooltip,
                    placement: 'top'
                }, {
                    default: () => h(ElIcon, { size: 14, style: { paddingLeft: '4px' } }, () => h(InfoFilled))
                })
            ])
        })
    }
})

export default _default