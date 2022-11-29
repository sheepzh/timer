/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { PropType } from "vue"

import { t } from "@app/locale"
import { ElIcon, ElTableColumn, ElTooltip } from "element-plus"
import { defineComponent, h } from "vue"
import { periodFormatter } from "../../formatter"
import { QuestionFilled } from "@element-plus/icons-vue"

function renderHeader() {
    return [
        t(msg => msg.item.total),
        h(ElTooltip, {
            content: t(msg => msg.item.totalTip),
            placement: 'top',
        }, () => h(ElIcon, {
            style: { paddingLeft: '3px' },
        }, () => h(QuestionFilled)))
    ]
}

const _default = defineComponent({
    name: "TotalColumn",
    props: {
        timeFormat: {
            type: String as PropType<timer.app.TimeFormat>
        }
    },
    setup(props) {
        return () => h(ElTableColumn, {
            prop: "total",
            minWidth: 130,
            align: "center",
        }, {
            header: renderHeader,
            default: ({ row }: { row: timer.stat.Row }) => periodFormatter(row.total, props.timeFormat)
        })
    }
})

export default _default