/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import TooltipWrapper from "@app/components/common/TooltipWrapper"
import { t } from "@app/locale"
import { periodFormatter } from "@app/util/time"
import { type ElTableRowScope } from "@pages/element-ui/table"
import { Effect, ElTableColumn } from "element-plus"
import { defineComponent, PropType } from "vue"
import CompositionTable from '../../CompositionTable'
import { useReportFilter } from "../../context"
import type { ReportSort } from "../../types"

const TimeColumn = defineComponent({
    props: {
        dimension: {
            type: String as PropType<timer.core.Dimension & 'focus' | 'run'>,
            required: true,
        }
    },
    setup(props) {
        const filter = useReportFilter()
        const formatter = (focus: number | undefined): string => periodFormatter(focus, { format: filter.value?.timeFormat })
        return () => (
            <ElTableColumn
                prop={props.dimension satisfies ReportSort['prop']}
                label={t(msg => msg.item[props.dimension])}
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
                            content: () => <CompositionTable valueFormatter={formatter} data={row.composition?.[props.dimension] || []} />
                        }}
                    >
                        {formatter(row[props.dimension])}
                    </TooltipWrapper>
                )}
            </ElTableColumn>
        )
    },
})

export default TimeColumn