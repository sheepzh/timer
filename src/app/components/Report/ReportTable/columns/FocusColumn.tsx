/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { PropType } from "vue"

import { t } from "@app/locale"
import { Effect, ElTableColumn, ElTooltip } from "element-plus"
import { defineComponent } from "vue"
import { periodFormatter } from "@app/util/time"
import CompositionTable from './CompositionTable'
import { ElTableRowScope } from "@src/element-ui/table"

const columnLabel = t(msg => msg.item.focus)

const _default = defineComponent({
    props: {
        timeFormat: String as PropType<timer.app.TimeFormat>,
        readRemote: Boolean,
    },
    setup({ timeFormat = "default", readRemote }) {
        return () => (
            <ElTableColumn prop="focus" label={columnLabel} minWidth={130} align="center" sortable="custom">
                {
                    ({ row }: ElTableRowScope<timer.stat.Row>) => {
                        const valueStr = periodFormatter(row.focus, timeFormat)
                        return readRemote
                            ? <ElTooltip
                                placement="top"
                                effect={Effect.LIGHT}
                                offset={10}
                                v-slots={{
                                    content: () => <CompositionTable
                                        data={row.composition?.focus || []}
                                        valueFormatter={val => periodFormatter(val, timeFormat)}
                                    />
                                }}
                            >
                                {valueStr}
                            </ElTooltip>
                            : valueStr
                    }
                }
            </ElTableColumn>
        )
    }
})

export default _default