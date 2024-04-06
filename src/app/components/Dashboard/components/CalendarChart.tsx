/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { TitleComponentOption, TooltipComponentOption, GridComponentOption, VisualMapComponentOption } from "echarts/components"

import { TitleComponent, TooltipComponent, GridComponent, VisualMapComponent } from "echarts/components"
import { ScatterChart, ScatterSeriesOption, type HeatmapSeriesOption } from "echarts/charts"
import { use, type ComposeOption } from "echarts/core"
import { SVGRenderer } from "echarts/renderers"

// Register echarts
use([
    SVGRenderer,
    ScatterChart,
    TooltipComponent,
    GridComponent,
    VisualMapComponent,
    TitleComponent,
])

import { t } from "@app/locale"
import statService from "@service/stat-service"
import { locale } from "@i18n"
import { getAllDatesBetween, getWeeksAgo, MILL_PER_MINUTE } from "@util/time"
import { defineComponent } from "vue"
import { groupBy, rotate } from "@util/array"
import { BASE_TITLE_OPTION } from "../common"
import { getPrimaryTextColor } from "@util/style"
import { getAppPageUrl } from "@util/constant/url"
import { REPORT_ROUTE } from "@app/router/constants"
import { createTabAfterCurrent } from "@api/chrome/tab"
import { useEcharts, EchartsWrapper } from "@hooks/useEcharts"
import { getHeatColors } from "@app/util/echarts"

const WEEK_NUM = 53

type _Value = [
    // X
    number,
    // Y
    number,
    // Value
    number,
    // date yyyyMMdd
    string,
]

type EcOption = ComposeOption<
    | ScatterSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | VisualMapComponentOption
>

function formatTooltip(minutes: number, date: string): string {
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    const year = date.substring(0, 4)
    const month = date.substring(4, 6)
    const day = date.substring(6, 8)
    const dateStr = t(msg => msg.calendar.dateFormat, { y: year, m: month, d: day })
    const valueStr = hour ? `${hour} h ${minute} m` : `${minute} m`
    return `${dateStr}<br/>${valueStr}`
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

const titleText = (totalHours: number) => t(msg => totalHours
    ? msg.dashboard.heatMap.title0
    : msg.dashboard.heatMap.title1,
    { hour: totalHours }
)

type HeatmapItem = HeatmapSeriesOption["data"][number]

const cvtHeatmapItem = (d: _Value): HeatmapItem => {
    let item: HeatmapItem = { value: d, itemStyle: undefined, label: undefined, emphasis: undefined }
    const minutes = d[2]
    if (!minutes) {
        item.itemStyle = { color: 'transparent' }
        item.emphasis = { disabled: true }
    }
    return item
}

function optionOf(data: _Value[], weekDays: string[], dom: HTMLElement): EcOption {
    const totalMinutes = data.map(d => d[2] || 0).reduce((a, b) => a + b, 0)
    const totalHours = Math.floor(totalMinutes / 60)
    const xAxisLabelMap = getXAxisLabelMap(data)
    const textColor = getPrimaryTextColor()
    const w = dom?.getBoundingClientRect?.()?.width
    const gridWidth = 0.86
    const colCount = new Set(data.map(v => v[0])).size
    const gridCellSize = colCount ? w * gridWidth / colCount * 0.7 : 0
    return {
        title: {
            ...BASE_TITLE_OPTION,
            text: titleText(totalHours),
            textStyle: { fontSize: '14px', color: textColor }
        },
        tooltip: {
            borderWidth: 0,
            formatter: (params: any) => {
                const { data } = params
                const { value } = data
                const [_1, _2, minutes, date] = value
                return minutes ? formatTooltip(minutes as number, date) : undefined
            },
        },
        grid: { height: '70%', left: '7%', width: `${gridWidth * 100}%`, top: '18%', },
        xAxis: {
            type: 'category',
            axisLine: { show: false },
            axisTick: { show: false, alignWithLabel: true },
            axisLabel: {
                formatter: (x: string) => xAxisLabelMap[x] || '',
                interval: 0,
                margin: 14,
                color: textColor,
            },
        },
        yAxis: {
            type: 'category',
            data: weekDays,
            axisLabel: { padding: /* T R B L */[0, 12, 0, 0], color: textColor },
            axisLine: { show: false },
            axisTick: { show: false, alignWithLabel: true },
        },
        visualMap: {
            min: 0,
            max: Math.max(...data.map(a => a[2])),
            inRange: { color: getHeatColors() },
            realtime: true,
            calculable: true,
            orient: 'vertical',
            right: '2%',
            top: 'center',
            dimension: 2,
            textStyle: { color: textColor },
        },
        series: {
            type: 'scatter',
            data: data.map(cvtHeatmapItem),
            symbol: 'rect',
            symbolSize: gridCellSize,
        },
    }
}

/**
 * Click to jump to the report page
 *
 * @since 1.1.1
 */
function handleClick(value: _Value): void {
    const [_1, _2, minutes, currentDate] = value
    if (!minutes) {
        return
    }

    const currentYear = parseInt(currentDate.substring(0, 4))
    const currentMonth = parseInt(currentDate.substring(4, 6)) - 1
    const currentDay = parseInt(currentDate.substring(6, 8))
    const currentTs = (new Date(currentYear, currentMonth, currentDay).getTime() + 1000).toString()
    const query: ReportQueryParam = { ds: currentTs, de: currentTs }

    const url = getAppPageUrl(false, REPORT_ROUTE, query)
    createTabAfterCurrent(url)
}

type BizOption = {
    startTime: Date
    endTime: Date
    value: { [date: string]: number }
}

class ChartWrapper extends EchartsWrapper<BizOption, EcOption> {
    protected generateOption({ startTime, endTime, value }: BizOption): EcOption | Promise<EcOption> {
        const allDates = getAllDatesBetween(startTime, endTime)
        const data: _Value[] = []
        allDates.forEach((date, index) => {
            const dailyMills = value[date] || 0
            const dailyMinutes = Math.floor(dailyMills / MILL_PER_MINUTE)
            const colIndex = parseInt((index / 7).toString())
            const weekDay = index % 7
            const x = colIndex, y = 7 - (1 + weekDay)
            data.push([x, y, dailyMinutes, date])
        })
        const weekDays = (t(msg => msg.calendar.weekDays)?.split?.('|') || []).reverse()
        if (locale !== "zh_CN") {
            // Let Sunday last
            // Saturday to Sunday
            rotate(weekDays, 1)
        }
        return optionOf(data, weekDays, this.getDom())
    }

    protected afterInit(): void {
        this.instance.on("click", (params: { value: _Value }) => handleClick(params.value as _Value))
    }
}

const fetchData = async (): Promise<BizOption> => {
    const endTime = new Date()
    const startTime: Date = getWeeksAgo(endTime, locale === "zh_CN", WEEK_NUM)
    const items = await statService.select({ date: [startTime, endTime], sort: "date" })
    const value: { [date: string]: number } = {}
    items.forEach(({ date, focus }) => value[date] = (value[date] || 0) + focus)
    return { value, startTime, endTime }
}

const _default = defineComponent(() => {
    const { elRef } = useEcharts(ChartWrapper, fetchData)

    return () => <div class="chart-container" ref={elRef} />
})

export default _default