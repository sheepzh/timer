/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Effect, ElTableColumn, ElTooltip } from "element-plus"
import { defineComponent } from "vue"
import { periodFormatter } from "@app/util/time"
import CompositionTable from './CompositionTable'
import { ElTableRowScope } from "@src/element-ui/table"
import { useReportFilter } from "../../context"

const _default = defineComponent(() => {
    const filter = useReportFilter()
    const formatter = (focus: number): string => periodFormatter(focus, { format: filter.value?.timeFormat })
    return () => (
        <ElTableColumn prop="focus" label={t(msg => msg.item.focus)} minWidth={130} align="center" sortable="custom">
            {
                ({ row }: ElTableRowScope<timer.stat.Row>) => {
                    const valueStr = formatter(row.focus)
                    return filter.value?.readRemote
                        ? <ElTooltip
                            placement="top"
                            effect={Effect.LIGHT}
                            offset={10}
                            v-slots={{
                                content: () => <CompositionTable valueFormatter={formatter} data={row.composition?.focus || []} />
                            }}
                        >
                            {valueStr}
                        </ElTooltip>
                        : valueStr
                }
            }
        </ElTableColumn>
    )
})

export default _default