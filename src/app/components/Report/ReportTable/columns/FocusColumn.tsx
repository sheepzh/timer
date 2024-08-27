/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { Effect, ElTableColumn } from "element-plus"
import { defineComponent } from "vue"
import { periodFormatter } from "@app/util/time"
import CompositionTable from '../../CompositionTable'
import { ElTableRowScope } from "@src/element-ui/table"
import { useReportFilter } from "../../context"
import TooltipWrapper from "@app/components/common/TooltipWrapper"

const _default = defineComponent(() => {
    const filter = useReportFilter()
    const formatter = (focus: number): string => periodFormatter(focus, { format: filter.value?.timeFormat })
    return () => (
        <ElTableColumn
            prop="focus"
            label={t(msg => msg.item.focus)}
            minWidth={130}
            align="center"
            sortable="custom"
        >
            {({ row }: ElTableRowScope<timer.stat.Row>) => (
                <TooltipWrapper
                    showPopover={filter.value?.readRemote}
                    placement="top"
                    effect={Effect.LIGHT}
                    offset={10}
                    v-slots={{
                        content: () => <CompositionTable valueFormatter={formatter} data={row.composition?.focus || []} />
                    }}
                >
                    {formatter(row.focus)}
                </TooltipWrapper>
            )}
        </ElTableColumn>
    )
})

export default _default