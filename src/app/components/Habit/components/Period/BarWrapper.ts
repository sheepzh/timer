/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ComposeOption } from "echarts/core"
import type { BarSeriesOption } from "echarts/charts"
import type { GridComponentOption, TooltipComponentOption } from "echarts/components"

import { use } from "echarts/core"
import { BarChart } from "echarts/charts"
import { SVGRenderer } from "echarts/renderers"
import { TooltipComponent, GridComponent } from "echarts/components"
import { formatPeriodCommon, formatTime } from "@util/time"
import { t } from "@app/locale"
import { getPrimaryTextColor } from "@util/style"
import { averageByDay } from "./common"
import { EchartsWrapper } from "@app/hooks/useEcharts"

use([BarChart, SVGRenderer, TooltipComponent, GridComponent])

type EcOption = ComposeOption<
    | BarSeriesOption
    | GridComponentOption
    | TooltipComponentOption
>

type BizOption = {
    data: timer.period.Row[]
    averageByDate: boolean
    periodSize: number
}

function formatXAxis(ts: number) {
    const date = new Date(ts)
    if (date.getHours() === 0 && date.getMinutes() === 0) {
        return formatTime(date, '{m}-{d}')
    } else {
        return formatTime(date, '{h}:{i}')
    }
}

function formatTimeOfEcharts(params: any, averageByDate: boolean): string {
    const format = params instanceof Array ? params[0] : params
    const { value, data } = format
    const milliseconds = data?.[4] || 0
    // If average, don't show the date
    const start = formatTime(value[2], averageByDate ? '{h}:{i}' : '{m}-{d} {h}:{i}')
    const end = formatTime(value[3], '{h}:{i}')
    return `${formatPeriodCommon(Math.floor(milliseconds))}<br/>${start}-${end}`
}

const Y_AXIS_MIN = t(msg => msg.habit.period.yAxisMin)
const Y_AXIS_HOUR = t(msg => msg.habit.period.yAxisHour)

function getYAxisName(periodSize: number) {
    return periodSize === 8 ? Y_AXIS_HOUR : Y_AXIS_MIN
}

function getYAxisValue(milliseconds: number, periodSize: number) {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Number.parseFloat((seconds / 60).toFixed(1))
    const hours = Number.parseFloat((minutes / 60).toFixed(1))
    return periodSize === 8 ? hours : minutes
}

type BarItem = BarSeriesOption["data"][number]

const cvt2Item = (row: timer.period.Row, periodSize: number): BarItem => {
    const startTime = row.startTime.getTime()
    const endTime = row.endTime.getTime()
    const x = (startTime + endTime) / 2
    const milliseconds = row.milliseconds
    return [x, getYAxisValue(milliseconds, periodSize), startTime, endTime, milliseconds]
}

function generateOption({ data, averageByDate, periodSize }: BizOption): EcOption {
    const periodData: timer.period.Row[] = averageByDate ? averageByDay(data, periodSize) : data
    const valueData: BarItem[] = periodData.map(i => cvt2Item(i, periodSize))
    const xAxisMin = periodData[0]?.startTime?.getTime()
    const xAxisMax = periodData[periodData.length - 1]?.endTime?.getTime()
    const xAxisAxisLabelFormatter = averageByDate ? '{HH}:{mm}' : formatXAxis
    const textColor = getPrimaryTextColor()

    return {
        tooltip: {
            formatter: (params: any) => formatTimeOfEcharts(params, averageByDate)
        },
        grid: {
            top: 35,
            bottom: 30,
            left: 100,
            right: 100,
        },
        xAxis: {
            axisLabel: { formatter: xAxisAxisLabelFormatter, color: textColor },
            type: 'time',
            axisLine: { show: false },
            min: xAxisMin,
            max: xAxisMax
        },
        yAxis: {
            name: getYAxisName(periodSize),
            nameTextStyle: { color: textColor },
            type: 'value',
            axisLabel: { color: textColor },
        },
        series: [{
            type: "bar",
            large: true,
            data: valueData,
            barGap: '0%', // Make series be overlap
            barCategoryGap: '0%'
        }]
    }
}
export default class ChartWrapper extends EchartsWrapper<BizOption, EcOption> {
    generateOption = generateOption
}