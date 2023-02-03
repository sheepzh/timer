/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h } from "vue"
import { Effect, ElTableColumn, ElTooltip } from "element-plus"
import { t } from "@app/locale"
import CompositionTable from "./composition-table"

const columnLabel = t(msg => msg.item.time)

const _default = defineComponent({
    name: "TimeColumn",
    props: {
        readRemote: Boolean,
    },
    setup(props) {
        return () => h(ElTableColumn, {
            prop: "time",
            label: columnLabel,
            minWidth: 130,
            align: 'center',
            sortable: 'custom'
        }, {
            default: ({ row }: { row: timer.stat.Row }) => {
                const valueStr = row.time?.toString?.() || '0'
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
                        data: row.composition?.time || [],
                        valueFormatter: val => val?.toString() || '0'
                    })
                })
            }
        })
    }
})

export default _default
