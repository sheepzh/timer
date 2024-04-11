/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ComposeOption } from "echarts/core"
import type { GridComponentOption, TooltipComponentOption, TitleComponentOption } from "echarts/components"
import type { BarSeriesOption } from "echarts/charts"

import { use } from "echarts/core"
import { BarChart } from "echarts/charts"
import { SVGRenderer } from "echarts/renderers"
import { TooltipComponent, GridComponent, TitleComponent } from "echarts/components"
import { mergeDate } from "@service/stat-service/merge"
import { t } from "@app/locale"
import { SeriesDataItem, formatFocusTooltip, generateTitleOption } from "./common"
import { EchartsWrapper } from "@hooks"

use([BarChart, SVGRenderer, TooltipComponent, GridComponent, TitleComponent])

type EcOption = ComposeOption<
    | BarSeriesOption
    | GridComponentOption
    | TooltipComponentOption
    | TitleComponentOption
>

type BizOption = {
    rows: timer.stat.Row[]
    timeFormat: timer.app.TimeFormat
}

const MARGIN_LEFT_P = 8
const MARGIN_RIGHT_P = 4
const TOP_NUM = 7

async function generateOption(rows: timer.stat.Row[] = [], timeFormat: timer.app.TimeFormat, dom: HTMLElement): Promise<EcOption> {
    const merged = mergeDate(rows)
    const top10 = merged.sort((a, b) => b.focus - a.focus).splice(0, TOP_NUM).reverse()
    const max = top10[top10.length - 1]?.focus ?? 0
    const hosts = top10.map(r => r.alias || r.host)

    const domW = dom.getBoundingClientRect().width
    const chartW = domW * (100 - MARGIN_LEFT_P - MARGIN_RIGHT_P) / 100

    const title = t(msg => msg.habit.site.histogramTitle, { n: TOP_NUM })

    return {
        title: generateTitleOption(title),
        grid: {
            left: `${MARGIN_LEFT_P}%`,
            containLabel: true,
            right: `${MARGIN_RIGHT_P}%`,
            top: "12%",
            bottom: '4%',
        },
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            formatter: (val: [any]) => formatFocusTooltip(val, timeFormat, { splitLine: true, ignorePercentage: true }),
        },
        xAxis: {
            type: "value",
            minInterval: 1,
            axisLabel: { show: false },
            splitLine: { show: false },
            min: 0,
            max: max,
        },
        yAxis: {
            type: "category",
            data: hosts,
            axisLabel: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
            },
        },
        series: [{
            type: "bar",
            data: top10.map(row => {
                const { focus: value = 0 } = row || {}
                const labelW = (value / max) * chartW - 8
                return {
                    value, row,
                    label: { show: labelW >= 50, width: labelW },
                }
            }),
            itemStyle: {
                borderRadius: [0, 12, 12, 0],
            },
            label: {
                position: 'insideRight',
                overflow: "truncate",
                ellipsis: '...',
                minMargin: 5,
                padding: [0, 4, 0, 0],
                formatter: (param: any) => {
                    const { row } = (param?.data || {}) as SeriesDataItem
                    const { host, alias } = row
                    return alias || host
                },
            }
        }]
    }
}

export default class HistogramWrapper extends EchartsWrapper<BizOption, EcOption> {
    generateOption = ({ rows, timeFormat }: BizOption) => generateOption(rows, timeFormat, this.getDom())
}
