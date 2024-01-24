/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent } from "vue"
import { Effect, ElTableColumn, ElTooltip } from "element-plus"
import { t } from "@app/locale"
import CompositionTable from "./CompositionTable"
import { useReportFilter } from "../../context"
import { ElTableRowScope } from "@src/element-ui/table"

const columnLabel = t(msg => msg.item.time)

const _default = defineComponent(() => {
    const filter = useReportFilter()
    return () => (
        <ElTableColumn prop="time" label={columnLabel} minWidth={130} align="center" sortable="custom">
            {({ row }: ElTableRowScope<timer.stat.Row>) => {
                const valueStr = row.time?.toString?.() || '0'
                return filter.value?.readRemote
                    ? <ElTooltip
                        placement="top"
                        effect={Effect.LIGHT}
                        offset={10}
                        v-slots={{
                            default: () => valueStr,
                            content: () => <CompositionTable
                                data={row.composition?.time || []}
                                valueFormatter={v => v?.toString?.() || "0"}
                            />
                        }}
                    />
                    : valueStr
            }}
        </ElTableColumn>
    )
})

export default _default