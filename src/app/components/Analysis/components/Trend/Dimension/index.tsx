/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { DimensionEntry, RingValue, ValueFormatter } from "@app/components/Analysis/util"
import type { PropType } from "vue"

import { computeRingText, formatValue } from "@app/components/Analysis/util"
import { defineComponent } from "vue"
import { KanbanIndicatorCell } from "@app/components/common/kanban"
import Chart from "./Chart"
import { cvt2LocaleTime } from "@app/util/time"

export type DimensionData = {
    thisPeriod: DimensionEntry[]
    previousPeriod: DimensionEntry[]
}

const _default = defineComponent({
    props: {
        maxLabel: String,
        maxValue: Number,
        averageLabel: String,
        maxDate: String,
        average: [Object, Object] as PropType<RingValue>,
        data: Object as PropType<DimensionData>,
        valueFormatter: Function as PropType<ValueFormatter>,
        chartTitle: String,
    },
    setup(p) {
        return () => (
            <div class="analysis-trend-dimension-container" >
                <div class="analysis-trend-dimension-indicator-container">
                    <div class="analysis-trend-dimension-indicator-item">
                        <KanbanIndicatorCell
                            mainName={p.maxLabel}
                            mainValue={p.valueFormatter ? p.valueFormatter(p.maxValue) : p.maxValue?.toString() || '-'}
                            subValue={p.maxDate ? `@${cvt2LocaleTime(p.maxDate)}` : ''}
                        />
                    </div>
                    <div class="analysis-trend-dimension-indicator-item">
                        <KanbanIndicatorCell
                            mainName={p.averageLabel}
                            mainValue={formatValue(p.average?.[0], p.valueFormatter)}
                            subTips={msg => msg.analysis.common.ringGrowth}
                            subValue={computeRingText(p.average, p.valueFormatter)}
                        />
                    </div>
                </div>
                <div class="analysis-trend-dimension-chart-container">
                    <Chart
                        data={p.data?.thisPeriod}
                        previous={p.data?.previousPeriod}
                        valueFormatter={p.valueFormatter}
                        title={p.chartTitle}
                    />
                </div>
            </div>
        )
    }
})

export default _default
