/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { RingValue } from "@app/components/Analysis/util"
import type { PropType } from "vue"
import type { I18nKey } from "@app/locale"

import { defineComponent } from "vue"
import { KanbanIndicatorCell } from "@app/components/common/kanban"
import { t } from "@app/locale"
import { periodFormatter } from "@app/util/time"
import { computeRingText } from "@app/components/Analysis/util"
import { useAnalysisTrendRangeLength } from "./context"
import { useAnalysisTimeFormat } from "../../context"

const DAY_LABEL = `${t(msg => msg.analysis.trend.activeDay)}/${t(msg => msg.analysis.trend.totalDay)}`
const VISIT_LABEL = t(msg => msg.analysis.common.visitTotal)
const FOCUS_LABEL = t(msg => msg.analysis.common.focusTotal)
const RING_TIP: I18nKey = msg => msg.analysis.common.ringGrowth

const computeDayValue = (activeDay: RingValue, rangeLength: number) => {
    const thisActiveDay = activeDay?.[0]
    return `${thisActiveDay?.toString() || '-'}/${rangeLength?.toString() || '-'}`
}

const _default = defineComponent({
    props: {
        activeDay: [Object, Object] as PropType<RingValue>,
        visit: [Object, Object] as PropType<RingValue>,
        focus: [Object, Object] as PropType<RingValue>,
    },
    setup(props) {
        const rangeLength = useAnalysisTrendRangeLength()
        const timeFormat = useAnalysisTimeFormat()
        return () => (
            <div class="analysis-trend-total-container">
                <div>
                    <KanbanIndicatorCell
                        mainName={DAY_LABEL}
                        mainValue={computeDayValue(props.activeDay, rangeLength.value)}
                        subTips={RING_TIP}
                        subValue={computeRingText(props.activeDay)}
                    />
                </div>
                <div>
                    <KanbanIndicatorCell
                        mainName={FOCUS_LABEL}
                        mainValue={periodFormatter(props.focus?.[0], { format: timeFormat.value })}
                        subTips={RING_TIP}
                        subValue={computeRingText(props.focus, delta => periodFormatter(delta, { format: timeFormat.value }))}
                    />
                </div>
                <div>
                    <KanbanIndicatorCell
                        mainName={VISIT_LABEL}
                        mainValue={props.visit?.[0]?.toString() || '-'}
                        subTips={RING_TIP}
                        subValue={computeRingText(props.visit)}
                    />
                </div>
            </div>
        )
    }
})

export default _default