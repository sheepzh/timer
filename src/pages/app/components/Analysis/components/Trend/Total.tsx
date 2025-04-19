/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { RingValue } from "@app/components/Analysis/util"
import { KanbanIndicatorCell } from "@app/components/common/kanban"
import { t } from "@app/locale"
import { periodFormatter } from "@app/util/time"
import { defineComponent } from "vue"
import { useAnalysisTimeFormat } from "../../context"
import { useAnalysisTrendRangeLength } from "./context"

const computeDayValue = (activeDay: RingValue | undefined, rangeLength: number) => {
    const thisActiveDay = activeDay?.[0]
    return `${thisActiveDay?.toString() || '-'}/${rangeLength?.toString() || '-'}`
}

type Props = Record<'activeDay' | 'visit' | 'focus', RingValue>

const _default = defineComponent<Props>(props => {
    const rangeLength = useAnalysisTrendRangeLength()
    const timeFormat = useAnalysisTimeFormat()
    return () => (
        <div class="analysis-trend-total-container">
            <KanbanIndicatorCell
                mainName={`${t(msg => msg.analysis.trend.activeDay)}/${t(msg => msg.analysis.trend.totalDay)}`}
                mainValue={computeDayValue(props.activeDay, rangeLength.value)}
                subRing={props.activeDay}
            />
            <KanbanIndicatorCell
                mainName={t(msg => msg.analysis.common.focusTotal)}
                mainValue={periodFormatter(props.focus?.[0], { format: timeFormat.value })}
                subRing={props.focus}
                valueFormatter={delta => periodFormatter(delta, { format: timeFormat.value })}
            />
            <KanbanIndicatorCell
                mainName={t(msg => msg.analysis.common.visitTotal)}
                mainValue={props.visit?.[0]?.toString() || '-'}
                subRing={props.visit}
            />
        </div>
    )
}, { props: ['activeDay', 'focus', 'visit'] })

export default _default