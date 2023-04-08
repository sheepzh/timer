/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { DimensionEntry } from "../../../util"
import type { ECharts, ComposeOption } from "echarts/core"
import type { LineSeriesOption } from "echarts/charts"
import type {
    TitleComponentOption,
    TooltipComponentOption,
    ToolboxComponentOption,
    GridComponentOption,
} from "echarts/components"

import { init, use } from "@echarts/core"
import LineChart from "@echarts/chart/line"
import SVGRenderer from "@echarts/svg-renderer"
import TitleComponent from "@echarts/component/title"
import TooltipComponent from "@echarts/component/tooltip"
import GridComponent from '@echarts/component/grid'

import { ValueFormatter } from "@app/components/analysis/util"
import { getSecondaryTextColor } from "@util/style"

use([
    LineChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    SVGRenderer,
])

type EcOption = ComposeOption<
    | LineSeriesOption
    | TitleComponentOption
    | ToolboxComponentOption
    | TooltipComponentOption
    | GridComponentOption
>

class ChartWrapper {
    instance: ECharts

    init(container: HTMLDivElement) {
        this.instance = init(container)
    }

    async render(entries: DimensionEntry[], title: string, valueFormatter: ValueFormatter) {
        const xAxis = entries.map(r => r.date)
        const yAxis = entries.map(r => r.value)

        const secondaryTextColor = getSecondaryTextColor()
        const option: EcOption = {
            backgroundColor: 'rgba(0,0,0,0)',
            title: {
                text: title,
                textStyle: {
                    color: secondaryTextColor,
                    fontSize: '14px',
                    fontWeight: 'normal',
                },
                left: 'center',
                top: '9%',
            },
            grid: {
                top: '30%',
                bottom: '10px',
                left: '5%',
                right: '5%',
            },
            tooltip: {
                trigger: 'axis',
                formatter(params: any) {
                    const format = params instanceof Array ? params[0] : params
                    const { name, value } = format
                    const valStr = valueFormatter?.(value) || value?.toString() || "NaN"
                    return `${name}<br/>${valStr}`
                },
            },
            xAxis: {
                type: 'category',
                data: xAxis,
                show: false,
            },
            yAxis: {
                type: 'value',
                axisLabel: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
            },
            series: {
                data: yAxis,
                type: 'line',
                symbol: 'none',
                areaStyle: {},
                smooth: true,
            }
        }
        this.instance?.setOption(option)
    }
}

export default ChartWrapper
