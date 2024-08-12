/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { EchartsWrapper } from "@hooks"
import {
    ComposeOption,
    GridComponentOption,
    TitleComponentOption,
    TooltipComponentOption,
    VisualMapComponentOption,
    EffectScatterSeriesOption
} from "echarts"
import { formatTime, getAllDatesBetween, getWeeksAgo, parseTime } from "@util/time"
import { EffectScatterChart } from "echarts/charts"
import { SVGRenderer } from "echarts/renderers"
import { use } from "echarts/core"
import { GridComponent, TitleComponent, TooltipComponent, VisualMapComponent } from "echarts/components"
import { groupBy, rotate } from "@util/array"
import { t } from "@app/locale"
import { getRegularTextColor, getSecondaryTextColor } from "@util/style"
import { periodFormatter } from "@app/util/time"
import { locale } from "@i18n"

type EcOption = ComposeOption<
    | EffectScatterSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | VisualMapComponentOption
>

type _Value = [
    // X
    number,
    // Y
    number,
    // milliseconds
    number,
    // date yyyyMMdd
    string,
]

use([
    SVGRenderer,
    EffectScatterChart,
    TooltipComponent,
    GridComponent,
    VisualMapComponent,
    TitleComponent,
])

const WEEK_NUM = 26

type EffectScatterItem = EffectScatterSeriesOption["data"][number]
const cvtHeatmapItem = (d: _Value): EffectScatterItem => {
    let item: EffectScatterItem = { value: d, itemStyle: undefined, label: undefined, emphasis: undefined }
    const minutes = d[2]
    if (!minutes) {
        item.itemStyle = { color: 'transparent' }
        item.emphasis = { disabled: true }
    }
    return item
}

function getXAxisLabelMap(data: _Value[]): { [x: string]: string } {
    const allMonthLabel = t(msg => msg.calendar.months).split('|')
    const result = {}
    // {[ x:string ]: Set<string> }
    const xAndMonthMap = groupBy(data, e => e[0], grouped => new Set(grouped.map(a => a[3].substring(4, 6))))
    let lastMonth = undefined
    Object.entries(xAndMonthMap).forEach(([x, monthSet]) => {
        if (monthSet.size != 1) {
            return
        }
        const currentMonth = Array.from(monthSet)[0]
        if (currentMonth === lastMonth) {
            return
        }
        lastMonth = currentMonth
        const monthNum = parseInt(currentMonth)
        const label = allMonthLabel[monthNum - 1]
        result[x] = label
    })
    return result
}

function optionOf(data: _Value[], weekDays: string[], format: timer.app.TimeFormat): EcOption {
    const xAxisLabelMap = getXAxisLabelMap(data)
    const axisTextColor = getSecondaryTextColor()
    return {
        title: {
            text: t(msg => msg.analysis.summary.calendarTitle),
            textStyle: {
                color: getRegularTextColor(),
                fontSize: '14px',
                fontWeight: 'normal',
            },
            left: 'center',
            top: '4%',
        },
        tooltip: {
            borderWidth: 0,
            formatter: (params: any) => {
                const { data } = params
                const { value } = data
                const [_1, _2, mills, date] = value as _Value
                if (!mills) return undefined
                const time = parseTime(date)
                return `${formatTime(time, t(msg => msg.calendar.dateFormat))}<br /><b>${periodFormatter(mills, { format })}</b>`
            },
        },
        grid: { height: '68%', width: '90%', left: '10%', top: '18%' },
        xAxis: {
            type: 'category',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                formatter: (x: string) => xAxisLabelMap[x] || '',
                interval: 0,
                color: axisTextColor,
            },
        },
        yAxis: {
            type: 'category',
            data: weekDays,
            axisLabel: { padding: /* T R B L */[0, 12, 0, 0], color: axisTextColor },
            axisLine: { show: false },
            axisTick: { show: false, alignWithLabel: true },
        },
        visualMap: {
            min: 0,
            max: Math.max(...data.map(a => a[2])),
            show: false,
            inRange: { color: ['rgb(55, 162, 255)', 'rgb(116, 21, 219)'] },
            dimension: 2,
        },
        series: {
            type: "effectScatter",
            data: data.map(cvtHeatmapItem),
            progressive: 5,
            progressiveThreshold: 10,
        },
    }
}

export type BizOption = {
    rows: timer.stat.Row[]
    timeFormat: timer.app.TimeFormat
}

class Wrapper extends EchartsWrapper<BizOption, EcOption> {
    protected generateOption({ rows = [], timeFormat }: BizOption): EcOption | Promise<EcOption> {
        const endTime = new Date()
        const startTime = getWeeksAgo(endTime, locale === "zh_CN", WEEK_NUM)
        const allDates = getAllDatesBetween(startTime, endTime)
        const value = groupBy(rows, r => r.date, l => l?.[0]?.focus)
        const data: _Value[] = []
        allDates.forEach((date, index) => {
            const dailyMills = value[date] || 0
            const colIndex = parseInt((index / 7).toString())
            const weekDay = index % 7
            const x = colIndex, y = 7 - (1 + weekDay)
            data.push([x, y, dailyMills, date])
        })
        const weekDays = (t(msg => msg.calendar.weekDays)?.split?.('|') || []).reverse()
        if (locale !== "zh_CN") {
            // Let Sunday last
            // Saturday to Sunday
            rotate(weekDays, 1)
        }
        return optionOf(data, weekDays, timeFormat)
    }
}

export default Wrapper