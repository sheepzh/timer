/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { formatValue, type DimensionEntry, type RingValue, type ValueFormatter } from "@app/components/Analysis/util"
import { KanbanIndicatorCell } from "@app/components/common/kanban"
import { cvt2LocaleTime } from "@app/util/time"
import { defineComponent, type PropType } from "vue"
import Chart from "./Chart"

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
    setup: p => {
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
                            subRing={p.average}
                            valueFormatter={p.valueFormatter}
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
