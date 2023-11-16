/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElSwitch, ElTableColumn } from "element-plus"
import { defineComponent, h, toRaw } from "vue"
import { t } from "@app/locale"
import { judgeVerificationRequired, processVerification } from "./common"
import optionService from "@service/option-service"

const label = t(msg => msg.limit.item.enabled)

async function handleChange(row: timer.limit.Item, newVal: boolean, callback: () => void) {
    let promise: Promise<void> = null
    if (!newVal && await judgeVerificationRequired(row)) {
        // Disable limited rules, so verification is required
        const option = await optionService.getAllOption()
        promise = processVerification(option)
    }
    promise
        ? promise.then(callback).catch(() => { })
        : callback()
}

const _default = defineComponent({
    name: "LimitEnabledColumn",
    emits: {
        rowChange: (_row: timer.limit.Item, _val: boolean) => true
    },
    setup(_, ctx) {
        return () => h(ElTableColumn, {
            prop: 'enabled',
            label,
            minWidth: 80,
            align: 'center',
        }, {
            default: ({ row }: { row: timer.limit.Item }) => h(ElSwitch, {
                modelValue: row.enabled,
                onChange: (val: boolean) => handleChange(row, val, () => {
                    row.enabled = val
                    ctx.emit("rowChange", toRaw(row), val)
                })
            })
        })
    }
})

export default _default