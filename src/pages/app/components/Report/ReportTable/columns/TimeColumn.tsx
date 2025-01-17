/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import TooltipWrapper from "@app/components/common/TooltipWrapper"
import { t } from "@app/locale"
import { type ElTableRowScope } from "@pages/element-ui/table"
import { Effect, ElTableColumn } from "element-plus"
import { defineComponent } from "vue"
import CompositionTable from "../../CompositionTable"
import { useReportFilter } from "../../context"
import type { ReportSort } from "../../types"

const columnLabel = t(msg => msg.item.time)

const _default = defineComponent(() => {
    const filter = useReportFilter()
    return () => (
        <ElTableColumn
            prop={'time' satisfies ReportSort['prop']}
            label={columnLabel}
            minWidth={130}
            align="center"
            sortable="custom"
        >
            {({ row }: ElTableRowScope<timer.stat.Row>) => (
                <TooltipWrapper
                    usePopover={filter.value?.readRemote}
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