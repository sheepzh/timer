/**
 * Copyright (c) 2023 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { DimensionEntry, RingValue, ValueFormatter } from "@app/components/analysis/util"
import type { PropType } from "vue"

import { computeRingText, formatValue } from "@app/components/analysis/util"
import { defineComponent, h } from "vue"
import Indicator from "../../common/indicator"
import Chart from "./chart"
import { cvt2LocaleTime } from "@app/util/time"

type RenderProps = {
    maxLabel: string
    maxValue: number
    averageLabel: string
    average: RingValue
    maxDate: string
    valueFormatter: ValueFormatter
}

const renderMax = ({ maxLabel, maxValue, valueFormatter: formatter, maxDate }: RenderProps) =>
    h('div', { class: 'analysis-trend-dimension-indicator-item' }, h(Indicator, {
        mainName: maxLabel,
        mainValue: formatter ? formatter(maxValue) : maxValue?.toString() || '-',
        subValue: maxDate ? `@${cvt2LocaleTime(maxDate)}` : '',
    }))

const renderAverage = ({ averageLabel, valueFormatter, average }: RenderProps) => {
    const currentAverage = average?.[0]
    return h('div', { class: 'analysis-trend-dimension-indicator-item' }, h(Indicator, {
        mainName: averageLabel,
        mainValue: formatValue(currentAverage, valueFormatter),
        subTips: msg => msg.analysis.common.ringGrowth,
        subValue: computeRingText(average, valueFormatter),
    }))
}


const _default = defineComponent({
    props: {
        maxLabel: String,
        maxValue: Number,
        averageLabel: String,
        averageValue: String,
        maxDate: String,
        average: [Object, Object] as PropType<RingValue>,
        data: Array as PropType<DimensionEntry[]>,
        valueFormatter: Function as PropType<ValueFormatter>,
        dateRange: [Object, Object] as PropType<[Date, Date]>,
        chartTitle: String,
    },
    setup(props) {
        return () => h('div', { class: "analysis-trend-dimension-container" }, [
            h('div', { class: 'analysis-trend-dimension-indicator-container' }, [
                renderMax(props),
                renderAverage(props),
            ]),
            h('div', { class: 'analysis-trend-dimension-chart-container' },
                h(Chart, { data: props.data, valueFormatter: props.valueFormatter, title: props.chartTitle })
            ),
        ])
    }
})

export default _default