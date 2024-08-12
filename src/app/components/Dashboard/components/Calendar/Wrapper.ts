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

import { EchartsWrapper } from "@hooks"
import { formatPeriodCommon, getAllDatesBetween, MILL_PER_HOUR, MILL_PER_MINUTE } from "@util/time"
import { groupBy, rotate, sum } from "@util/array"
import { t } from "@app/locale"
import { getPrimaryTextColor } from "@util/style"
import { BASE_TITLE_OPTION } from "../../common"
import { getAppPageUrl } from "@util/constant/url"
import { REPORT_ROUTE } from "@app/router/constants"
import { createTabAfterCurrent } from "@api/chrome/tab"
import { getStepColors } from "@app/util/echarts"
import { locale } from "@i18n"

type _Value = [
    x: number,
    y: number,
    dailyMill: number,
    date: string, // yyyymmdd
]

type EcOption = ComposeOption<
    | ScatterSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | VisualMapComponentOption
>

export type BizOption = {
    startTime: Date
    endTime: Date
    value: { [date: string]: number }
}

function formatTooltip(mills: number, date: string): string {
    const y = date.substring(0, 4)
    const m = date.substring(4, 6)
    const d = date.substring(6, 8)
    const dateStr = t(msg => msg.calendar.dateFormat, { y, m, d })
    const timeStr = formatPeriodCommon(mills)
    return `${dateStr}</br><b>${timeStr}</b>`
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

type Piece = {
    label: string
    min: number
    max: number
    color?: string
}

const minOf = (min: number) => min * MILL_PER_MINUTE
const hourOf = (hour: number) => hour * MILL_PER_HOUR

const ALL_PIECES: Piece[] = [
    { min: 1, max: minOf(10), label: "<10m" },
    { min: minOf(10), max: minOf(30), label: "<30m" },
    { min: minOf(30), max: hourOf(1), label: "<1h" },
    { min: hourOf(1), max: hourOf(2), label: "<2h" },
    { min: hourOf(2), max: hourOf(4), label: "<4h" },
    { min: hourOf(4), max: hourOf(7), label: "<7h" },
    { min: hourOf(7), max: hourOf(12), label: "<12h" },
    { min: hourOf(12), max: hourOf(18), label: "<18h" },
    { min: hourOf(18), max: hourOf(24), label: ">=18h" },
]

const computePieces = (min: number, max: number): Piece[] => {
    let pieces = ALL_PIECES.filter((p, i) => i === 0 || p.min <= max)
    pieces = pieces.filter((p, i) => p.max > min || i === pieces.length - 1)

    const colors = getStepColors(pieces.length)
    return pieces.map((p, idx) => ({ ...p, color: colors[idx] }))
}

function optionOf(data: _Value[], weekDays: string[], dom: HTMLElement): EcOption {
    const totalMills = sum(data?.map(d => d[2] ?? 0))
    const totalHours = Math.floor(totalMills / MILL_PER_HOUR)
    const xAxisLabelMap = getXAxisLabelMap(data)
    const textColor = getPrimaryTextColor()
    const w = dom?.getBoundingClientRect?.()?.width
    const gridWidth = 0.85
    const colCount = new Set(data.map(v => v[0])).size
    const gridCellSize = colCount ? w * gridWidth / colCount * 0.75 : 0

    const maxVal = Math.max(...data.map(a => a[2]))
    const minVal = Math.min(...data.map(a => a[2]).filter(v => v))
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
                const [_1, _2, mills, date] = value
                return mills ? formatTooltip(mills as number, date) : undefined
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
            type: 'piecewise',
            realtime: true,
            calculable: true,
            orient: 'vertical',
            right: '2%',
            top: 'center',
            dimension: 2,
            splitNumber: 6,
            showLabel: true,
            pieces: computePieces(minVal, maxVal),
            textStyle: { color: getPrimaryTextColor() },
        },
        series: {
            type: 'scatter',
            data: data.map(cvtHeatmapItem),
            symbol: 'circle',
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

class Wrapper extends EchartsWrapper<BizOption, EcOption> {
    protected generateOption({ startTime, endTime, value }: BizOption): EcOption | Promise<EcOption> {
        const allDates = getAllDatesBetween(startTime, endTime)
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
        return optionOf(data, weekDays, this.getDom())
    }

    protected afterInit(): void {
        this.instance.on("click", (params: { value: _Value }) => handleClick(params.value as _Value))
    }
}


export default Wrapper