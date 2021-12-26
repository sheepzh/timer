/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { EChartOption } from "echarts"
import { PeriodKey, PERIODS_PER_DATE } from "@entity/dto/period-info"
import PeriodResult from "@entity/dto/period-result"
import { formatPeriodCommon, formatTime, MILL_PER_DAY } from "@util/time"
import { t } from "@app/locale"

const formatTimeOfEchart = (params: EChartOption.Tooltip.Format | EChartOption.Tooltip.Format[], average: boolean) => {
    const format: EChartOption.Tooltip.Format = params instanceof Array ? params[0] : params
    const { value } = format
    // If average, don't show the date
    const start = formatTime(value[2], average ? '{h}:{i}' : '{m}-{d} {h}:{i}')
    const end = formatTime(value[3], '{h}:{i}')
    return `${formatPeriodCommon(value[1] * 1000)}<br/>${start}-${end}`
}

const title = t(msg => msg.habit.chart.title)
const baseOptions: EChartOption<EChartOption.SeriesBar> = {
    title: {
        text: title,
        left: 'center'
    },
    tooltip: {},
    toolbox: {
        show: true,
        feature: {
            saveAsImage: {
                show: true,
                title: t(msg => msg.habit.chart.saveAsImageTitle),
                name: title, // file name
                excludeComponents: ['toolbox'],
                pixelRatio: 1
            }
        }
    },
    xAxis: {
        axisLabel: {/** placeholder */ },
        type: 'time',
        axisLine: {
            show: false
        }
    },
    yAxis: {
        name: t(msg => msg.habit.chart.yAxisName),
        type: 'value'
    },
    series: [{
        type: "bar",
        large: true,
        data: [],
        barGap: '0%', // Make series be overlap
        barCategoryGap: '0%'
    }]
}

type _Props = {
    data: PeriodResult[]
    average: boolean
    periodSize: number
}

export type OptionProps = _Props

const averageByDay = (data: PeriodResult[], periodSize: number) => {
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

const generateOptions = ({ data, average, periodSize }: _Props) => {
    const periodData: PeriodResult[] = average ? averageByDay(data, periodSize) : data
    const valueData: any[] = []
    periodData.forEach((item) => {
        const startTime = item.startTime.getTime()
        const endTime = item.endTime.getTime()
        const seconds = Math.floor(item.milliseconds / 1000)
        const x = (startTime + endTime) / 2
        valueData.push([x, seconds, startTime, endTime])
    })
    const xAxis = baseOptions.xAxis as EChartOption.XAxis
    xAxis.min = periodData[0].startTime.getTime()
    xAxis.max = periodData[periodData.length - 1].endTime.getTime()
    xAxis.axisLabel.formatter = average ? '{HH}:{mm}' : formatXAxis
    baseOptions.series[0].data = valueData
    baseOptions.tooltip.formatter = params => formatTimeOfEchart(params, average)

    return baseOptions
}

export default generateOptions