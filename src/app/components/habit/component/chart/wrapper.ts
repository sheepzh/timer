/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ECharts } from "echarts/core"
import type { ComposeOption } from "echarts/core"
import type { BarSeriesOption } from "echarts/charts"
import type { GridComponentOption, TitleComponentOption, ToolboxComponentOption, TooltipComponentOption } from "echarts/components"

import { use, init } from "@echarts/core"
import BarChart from "@echarts/chart/bar"
import CanvasRenderer from "@echarts/canvas-renderer"
import TitleComponent from "@echarts/component/title"
import TooltipComponent from "@echarts/component/tooltip"
import ToolboxComponent from "@echarts/component/toolbox"
import GridComponent from "@echarts/component/grid"

use([BarChart, CanvasRenderer, TitleComponent, TooltipComponent, ToolboxComponent, GridComponent])

import { PeriodKey, PERIODS_PER_DATE } from "@entity/dto/period-info"
import PeriodResult from "@entity/dto/period-result"
import { formatPeriodCommon, formatTime, MILL_PER_DAY } from "@util/time"
import { t } from "@app/locale"

type EcOption = ComposeOption<
    | BarSeriesOption
    | GridComponentOption
    | TitleComponentOption
    | ToolboxComponentOption
    | TooltipComponentOption
>

function averageByDay(data: PeriodResult[], periodSize: number): PeriodResult[] {
    const rangeStart = data[0].startTime
    const rangeEnd = data[data.length - 1].endTime
    const dateNum = (rangeEnd.getTime() - rangeStart.getTime()) / MILL_PER_DAY
    const map: Map<number, number> = new Map()
    data.forEach(item => {
        const key = Math.floor(item.getStartOrder() / periodSize)
        const val = map.get(key) || 0
        map.set(key, val + item.milliseconds)
    })
    const result = []
    let period = PeriodKey.of(new Date(), 0)
    for (let i = 0; i < PERIODS_PER_DATE / periodSize; i++) {
        const key = period.order / periodSize
        const val = map.get(key) || 0
        const averageMill = Math.round(val / dateNum)
        result.push(PeriodResult.of(period.after(periodSize - 1), periodSize, averageMill))
        period = period.after(periodSize)
    }
    return result
}

function formatXAxis(ts: number) {
    const date = new Date(ts)
    if (date.getHours() === 0 && date.getMinutes() === 0) {
        return formatTime(date, '{m}-{d}')
    } else {
        return formatTime(date, '{h}:{i}')
    }
}

function formatTimeOfEchart(params: any, averageByDate: boolean): string {
    const format = params instanceof Array ? params[0] : params
    const { value } = format
    // If average, don't show the date
    const start = formatTime(value[2], averageByDate ? '{h}:{i}' : '{m}-{d} {h}:{i}')
    const end = formatTime(value[3], '{h}:{i}')
    return `${formatPeriodCommon(value[1] * 1000)}<br/>${start}-${end}`
}

const TITLE = t(msg => msg.habit.chart.title)
const Y_AXIAS_NAME = t(msg => msg.habit.chart.yAxisName)
function generateOptions(data: PeriodResult[], averageByDate: boolean, periodSize: number): EcOption {
    const periodData: PeriodResult[] = averageByDate ? averageByDay(data, periodSize) : data
    const valueData: any[] = []
    periodData.forEach((item) => {
        const startTime = item.startTime.getTime()
        const endTime = item.endTime.getTime()
        const seconds = Math.floor(item.milliseconds / 1000)
        const x = (startTime + endTime) / 2
        valueData.push([x, seconds, startTime, endTime])
    })

    const xAxisMin = periodData[0].startTime.getTime()
    const xAxisMax = periodData[periodData.length - 1].endTime.getTime()
    const xAxisAxisLabelFormatter = averageByDate ? '{HH}:{mm}' : formatXAxis
    return {
        title: {
            text: TITLE,
            left: 'center'
        },
        tooltip: {
            formatter: (params: any) => formatTimeOfEchart(params, averageByDate)
        },
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {
                    show: true,
                    title: t(msg => msg.habit.chart.saveAsImageTitle),
                    name: TITLE, // file name
                    excludeComponents: ['toolbox'],
                    pixelRatio: 1
                }
            }
        },
        xAxis: {
            axisLabel: { formatter: xAxisAxisLabelFormatter },
            type: 'time',
            axisLine: { show: false },
            min: xAxisMin,
            max: xAxisMax
        },
        yAxis: { name: Y_AXIAS_NAME, type: 'value' },
        series: [{
            type: "bar",
            large: true,
            data: valueData,
            barGap: '0%', // Make series be overlap
            barCategoryGap: '0%'
        }]
    }
}

export default class ChartWrapper {
    instance: ECharts

    init(container: HTMLDivElement) {
        this.instance = init(container)
    }

    render(data: PeriodResult[], averageByDate: boolean, periodSize: number) {
        if (!this.instance) {
            throw new Error("Instance not initialized")
        }
        const option: EcOption = generateOptions(data, averageByDate, periodSize)
        this.instance.setOption(option)
    }
}