/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { PropType } from "vue"

import { t } from "@app/locale"
import { Effect, ElTableColumn, ElTooltip } from "element-plus"
import { defineComponent, h } from "vue"
import { periodFormatter } from "../../formatter"
import CompositionTable from './composition-table'

const columnLabel = t(msg => msg.item.focus)

const _default = defineComponent({
    name: "FocusColumn",
    props: {
        timeFormat: String as PropType<timer.app.TimeFormat>,
        readRemote: Boolean,
    },
    setup(props) {
        return () => h(ElTableColumn, {
            prop: "focus",
            label: columnLabel,
            minWidth: 130,
            align: "center",
            sortable: "custom"
        }, {
            default({ row }: { row: timer.stat.Row }) {
                const valueStr = periodFormatter(row.focus, props.timeFormat || "default")
                if (!props.readRemote) {
                    return valueStr
                }
                return h(ElTooltip, {
                    placement: "top",
                    effect: Effect.LIGHT,
                    offset: 10
                }, {
                    default: () => valueStr,
                    content: () => h(CompositionTable, {
                        data: row.composition?.focus || [],
                        valueFormatter: val => periodFormatter(val, props.timeFormat || 'default'),
                    })
                })
            }
        })
    }
})

export default _default