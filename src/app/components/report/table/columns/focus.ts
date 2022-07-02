/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { ElTableColumn } from "element-plus"
import { defineComponent, h } from "vue"
import { periodFormatter } from "../../formatter"

const columnLabel = t(msg => msg.item.focus)

const _default = defineComponent({
    name: "FocusColumn",
    props: {
        displayBySecond: {
            type: Boolean
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
            default: ({ row }: { row: timer.stat.Row }) => periodFormatter(row.focus, props.displayBySecond || false)
        })
    }
})

export default _default