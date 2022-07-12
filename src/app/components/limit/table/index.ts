/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTable } from "element-plus"
import { defineComponent, h, PropType } from "vue"
import TimeLimitItem from "@entity/dto/time-limit-item"
import LimitCondColumn from "./column/cond"
import LimitTimeColumn from "./column/time"
import LimitWasteColumn from "./column/waste"
import LimitDelayColumn from "./column/delay"
import LimitEnabledColumn from "./column/enabled"
import LimitOperationColumn from "./column/operation"

const _default = defineComponent({
    name: "LimitTable",
    props: {
        data: Array as PropType<TimeLimitItem[]>
    },
    emits: ["delayChange", "enabledChange", "delete"],
    setup(props, ctx) {
        return () => h(ElTable, {
            border: true,
            size: 'small',
            style: { width: '100%' },
            highlightCurrentRow: true,
            fit: true,
            data: props.data
        }, () => [
            h(LimitCondColumn),
            h(LimitTimeColumn),
            h(LimitWasteColumn),
            h(LimitDelayColumn, {
                onRowChange: (row: TimeLimitItem, _allowDelay: boolean) => ctx.emit("delayChange", row)
            }),
            h(LimitEnabledColumn, {
                onRowChange: (row: TimeLimitItem, _enabled: boolean) => ctx.emit("enabledChange", row)
            }),
            h(LimitOperationColumn, {
                onRowDelete: (row: TimeLimitItem, _cond: string) => ctx.emit("delete", row)
            })
        ])
    }
})

export default _default

