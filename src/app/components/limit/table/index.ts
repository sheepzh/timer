/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTable } from "element-plus"
import { defineComponent, h, PropType } from "vue"
import LimitCondColumn from "./column/cond"
import LimitTimeColumn from "./column/time"
import LimitWasteColumn from "./column/waste"
import LimitDelayColumn from "./column/delay"
import LimitEnabledColumn from "./column/enabled"
import LimitOperationColumn from "./column/operation"

const _default = defineComponent({
    name: "LimitTable",
    props: {
        data: Array as PropType<timer.limit.Item[]>
    },
    emits: {
        delayChange: (_row: timer.limit.Item) => true,
        enabledChange: (_row: timer.limit.Item) => true,
        delete: (_row: timer.limit.Item) => true,
        modify: (_row: timer.limit.Item) => true,
    },
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
                onRowChange: (row: timer.limit.Item) => ctx.emit("delayChange", row)
            }),
            h(LimitEnabledColumn, {
                onRowChange: (row: timer.limit.Item) => ctx.emit("enabledChange", row)
            }),
            h(LimitOperationColumn, {
                onRowDelete: (row: timer.limit.Item) => ctx.emit("delete", row),
                onRowModify: (row: timer.limit.Item) => ctx.emit("modify", row),
            })
        ])
    }
})

export default _default

