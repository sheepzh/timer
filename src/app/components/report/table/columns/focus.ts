/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { PropType } from "vue"

import { t } from "@app/locale"
import { ElTableColumn } from "element-plus"
import { defineComponent, h } from "vue"
import { periodFormatter } from "../../formatter"

const columnLabel = t(msg => msg.item.focus)

const _default = defineComponent({
    name: "FocusColumn",
    props: {
        timeFormat: {
            type: String as PropType<timer.app.TimeFormat>
        }
    },
    setup(props) {
        return () => h(ElTableColumn, {
            prop: "focus",
            label: columnLabel,
            minWidth: 130,
            align: "center",
            sortable: "custom"
        }, {
            default: ({ row }: { row: timer.stat.Row }) => periodFormatter(row.focus, props.timeFormat || "default")
        })
    }
})

export default _default