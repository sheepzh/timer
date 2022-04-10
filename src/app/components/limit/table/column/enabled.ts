/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElSwitch, ElTableColumn } from "element-plus"
import { defineComponent, h } from "vue"
import TimeLimitItem from "@entity/dto/time-limit-item"
import { t } from "@app/locale"

const label = t(msg => msg.limit.item.enabled)

const _default = defineComponent({
    name: "LimitEnabledColumn",
    emits: ["rowChange"],
    setup(_, ctx) {
        return () => h(ElTableColumn, {
            prop: 'enabled',
            label,
            minWidth: 80,
            align: 'center',
        }, {
            default: ({ row }: { row: TimeLimitItem }) => h(ElSwitch, {
                modelValue: row.enabled,
                onChange(val: boolean) {
                    row.enabled = val
                    ctx.emit("rowChange", row, val)
                }
            })
        })
    }
})

export default _default