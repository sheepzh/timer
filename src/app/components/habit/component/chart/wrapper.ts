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
import SVGRenderer from "@echarts/svg-renderer"
import TitleComponent from "@echarts/component/title"
import TooltipComponent from "@echarts/component/tooltip"
import ToolboxComponent from "@echarts/component/toolbox"
import GridComponent from "@echarts/component/grid"

use([BarChart, SVGRenderer, TitleComponent, TooltipComponent, ToolboxComponent, GridComponent])

import { formatPeriodCommon, formatTime, MILL_PER_DAY } from "@util/time"
import { t } from "@app/locale"
import { getPrimaryTextColor, getSecondaryTextColor } from "@util/style"
import { after, keyOf, PERIODS_PER_DATE, rowOf, startOrderOfRow } from "@util/period"

type EcOption = ComposeOption<
    | BarSeriesOption
    | GridComponentOption
    | TitleComponentOption
    | ToolboxComponentOption
    | TooltipComponentOption
>

function averageByDay(data: timer.period.Row[], periodSize: number): timer.period.Row[] {
    const rangeStart = data[0].startTime
    const rangeEnd = data[data.length - 1].endTime
    const dateNum = (rangeEnd.getTime() - rangeStart.getTime()) / MILL_PER_DAY
    const map: Map<number, number> = new Map()
    data.forEach(item => {
        const key = Math.floor(startOrderOfRow(item) / periodSize)
        const val = map.get(key) || 0
        map.set(key, val + item.milliseconds)
    })
    const result = []
    let period = keyOf(new Date(), 0)
    for (let i = 0; i < PERIODS_PER_DATE / periodSize; i++) {
        const key = period.order / periodSize
        const val = map.get(key) || 0
        const averageMill = Math.round(val / dateNum)
        result.push(rowOf(after(period, periodSize - 1), periodSize, averageMill))
        period = after(period, periodSize)
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
    const { value, data } = format
    const milliseconds = data?.[4] || 0
    // If average, don't show the date
    const start = formatTime(value[2], averageByDate ? '{h}:{i}' : '{m}-{d} {h}:{i}')
    const end = formatTime(value[3], '{h}:{i}')
    return `${formatPeriodCommon(Math.floor(milliseconds))}<br/>${start}-${end}`
}

const TITLE = t(msg => msg.habit.chart.title)
const Y_AXIAS_MIN = t(msg => msg.habit.chart.yAxisMin)
const Y_AXIAS_HOUR = t(msg => msg.habit.chart.yAxisHour)

function getYAxiasName(periodSize: number) {
    return periodSize === 8 ? Y_AXIAS_HOUR : Y_AXIAS_MIN
}

function getYAxiasValue(milliseconds: number, periodSize: number) {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Number.parseFloat((seconds / 60).toFixed(1))
    const hours = Number.parseFloat((minutes / 60).toFixed(1))
    return periodSize === 8 ? hours : minutes
}

function generateOptions(data: timer.period.Row[], averageByDate: boolean, periodSize: number): EcOption {
    const periodData: timer.period.Row[] = averageByDate ? averageByDay(data, periodSize) : data
    const valueData: any[] = []
    periodData.forEach((item) => {
        const startTime = item.startTime.getTime()
        const endTime = item.endTime.getTime()
        const x = (startTime + endTime) / 2
        const milliseconds = item.milliseconds
        valueData.push([x, getYAxiasValue(milliseconds, periodSize), startTime, endTime, milliseconds])
    })

    const xAxisMin = periodData[0].startTime.getTime()
    const xAxisMax = periodData[periodData.length - 1].endTime.getTime()
    const xAxisAxisLabelFormatter = averageByDate ? '{HH}:{mm}' : formatXAxis
    const textColor = getPrimaryTextColor()
    const secondaryTextColor = getSecondaryTextColor()
    return {
        title: {
            text: TITLE,
            textStyle: { color: textColor },
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
                    pixelRatio: 1,
                    iconStyle: {
                        borderColor: secondaryTextColor
                    }
                }
            }
        },
        xAxis: {
            axisLabel: { formatter: xAxisAxisLabelFormatter, color: textColor },
            type: 'time',
            axisLine: { show: false },
            min: xAxisMin,
            max: xAxisMax
        },
        yAxis: {
            name: getYAxiasName(periodSize),
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

export default class ChartWrapper {
    instance: ECharts

    init(container: HTMLDivElement) {
        this.instance = init(container)
    }

    render(data: timer.period.Row[], averageByDate: boolean, periodSize: number) {
        if (!this.instance) {
            throw new Error("Instance not initialized")
        }
        const option: EcOption = generateOptions(data, averageByDate, periodSize)
        this.instance.setOption(option)
    }
}