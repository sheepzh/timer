/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent } from "vue"
import { Effect, ElTableColumn } from "element-plus"
import { t } from "@app/locale"
import CompositionTable from "../../CompositionTable"
import { useReportFilter } from "../../context"
import { ElTableRowScope } from "@src/element-ui/table"
import TooltipWrapper from "@app/components/common/TooltipWrapper"

const columnLabel = t(msg => msg.item.time)

const _default = defineComponent(() => {
    const filter = useReportFilter()
    return () => (
        <ElTableColumn prop="time" label={columnLabel} minWidth={130} align="center" sortable="custom">
            {({ row }: ElTableRowScope<timer.stat.Row>) => (
                <TooltipWrapper
                    showPopover={filter.value?.readRemote}
                    placement="top"
                    effect={Effect.LIGHT}
                    offset={10}
                    v-slots={{
                        content: () => <CompositionTable data={row.composition?.time || []} />
                    }}
                >
                    {row.time?.toString?.() || '0'}
                </TooltipWrapper>
            )}
        </ElTableColumn>
    )
})

export default _default