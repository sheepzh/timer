/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ECharts, ComposeOption } from "echarts/core"
import type { HeatmapSeriesOption } from "echarts/charts"
import type { TitleComponentOption, TooltipComponentOption, GridComponentOption, VisualMapComponentOption } from "echarts/components"

import TitleComponent from "@echarts/component/title"
import TooltipComponent from "@echarts/component/tooltip"
import GridComponent from "@echarts/component/grid"
import VisualMapComponent from "@echarts/component/visual-map"
import HeatmapChart from "@echarts/chart/heatmap"
import { init, use } from "@echarts/core"
import CanvasRenderer from "@echarts/canvas-renderer"

// Register echarts
use([
    CanvasRenderer,
    HeatmapChart,
    TooltipComponent,
    GridComponent,
    VisualMapComponent,
    TitleComponent,
])

import { t } from "@app/locale"
import { MILL_PER_MINUTE } from "@entity/dto/period-info"
import timerService, { TimerQueryParam } from "@service/timer-service"
import { locale } from "@util/i18n"
import { formatTime, getWeeksAgo, MILL_PER_DAY } from "@util/time"
import { ElLoading } from "element-plus"
import { defineComponent, h, onMounted, ref, Ref } from "vue"
import { groupBy, rotate } from "@util/array"
import { BASE_TITLE_OPTION } from "../common"

const WEEK_NUM = 53

const CONTAINER_ID = "__timer_dashboard_heatmap"

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
    | HeatmapSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | VisualMapComponentOption
>

function formatTooltip(minutes: number, date: string): string {
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    const year = date.substr(0, 4)
    const month = date.substr(4, 2)
    const day = date.substr(6, 2)
    const placeholders = {
        hour, minute, year, month, day
    }

    return t(
        msg => hour
            // With hour
            ? msg.dashboard.heatMap.tooltip1
            // Without hour
            : msg.dashboard.heatMap.tooltip0,
        placeholders
    )
}

function getGridColors() {
    return ['a', 'b', 'c', 'd'].map(ch => getComputedStyle(document.body).getPropertyValue(`--timer-dashboard-heatmap-color-${ch}`))
}

function getXAxisLabelMap(data: _Value[]): { [x: string]: string } {
    const allMonthLabel = t(msg => msg.calendar.months).split('|')
    const result = {}
    // {[ x:string ]: Set<string> }
    const xAndMonthMap = groupBy(data, e => e[0], grouped => new Set(grouped.map(a => a[3].substr(4, 2))))
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

function optionOf(data: _Value[], days: string[]): EcOption {
    const totalMinutes = data.map(d => d[2] || 0).reduce((a, b) => a + b, 0)
    const totalHours = Math.floor(totalMinutes / 60)
    const xAxisLabelMap = getXAxisLabelMap(data)
    return {
        title: {
            ...BASE_TITLE_OPTION,
            text: t(msg => totalHours
                ? msg.dashboard.heatMap.title0
                : msg.dashboard.heatMap.title1,
                { hour: totalHours }
            )
        },
        tooltip: {
            position: 'top',
            formatter: (params: any) => {
                const { data } = params
                const { value } = data
                const [_1, _2, minutes, date] = value
                return minutes ? formatTooltip(minutes as number, date) : undefined
            }
        },
        grid: { height: '70%', width: '82%', left: '8%', top: '18%', },
        xAxis: {
            type: 'category',
            axisLine: { show: false },
            axisTick: { show: false, alignWithLabel: true },
            axisLabel: {
                formatter: (x: string) => xAxisLabelMap[x] || '',
                interval: 0,
                margin: 14,
            },
        },
        yAxis: {
            type: 'category',
            data: days,
            axisLabel: { padding: /* T R B L */[0, 12, 0, 0] },
            axisLine: { show: false },
            axisTick: { show: false, alignWithLabel: true }
        },
        visualMap: [{
            min: 1,
            max: Math.max(...data.map(a => a[2])),
            inRange: { color: getGridColors() },
            realtime: true,
            calculable: true,
            orient: 'vertical',
            right: '2%',
            top: 'center',
            dimension: 2
        }],
        series: [{
            name: 'Daily Focus',
            type: 'heatmap',
            data: data.map(d => {
                let item = { value: d, itemStyle: undefined, label: undefined, emphasis: undefined, tooltip: undefined, silent: false }
                const minutes = d[2]
                const date = d[3]
                if (minutes) {
                } else {
                    item.itemStyle = {
                        color: '#fff',
                    }
                    item.emphasis = {
                        disabled: true
                    }
                    item.silent = true
                }
                return item
            }),
            progressive: 5,
            progressiveThreshold: 10,
        }]
    }
}

class ChartWrapper {
    instance: ECharts
    allDates: string[]

    constructor(startTime: Date, endTime: Date) {
        let currentTs = startTime.getTime()
        let maxTs = endTime.getTime()
        this.allDates = []
        for (; currentTs < maxTs; currentTs += MILL_PER_DAY) {
            this.allDates.push(formatTime(currentTs, '{y}{m}{d}'))
        }
    }

    init(container: HTMLDivElement) {
        this.instance = init(container)
    }

    render(value: { [date: string]: number }, days: string[], loading: { close: () => void }) {
        const data: _Value[] = []
        this.allDates.forEach((date, index) => {
            const dailyMills = value[date] || 0
            const dailyMinutes = Math.floor(dailyMills / MILL_PER_MINUTE)
            const colIndex = parseInt((index / 7).toString())
            const weekDay = index % 7
            const x = colIndex, y = 7 - (1 + weekDay)
            data.push([x, y, dailyMinutes, date])
        })
        const option = optionOf(data, days)
        this.instance.setOption(option)
        loading.close()
    }
}

const _default = defineComponent({
    name: "CalendarHeatMap",
    setup() {
        const isChinese = locale === "zh_CN"
        const now = new Date()
        const startTime: Date = getWeeksAgo(now, isChinese, WEEK_NUM)

        const chart: Ref = ref()
        const chartWrapper: ChartWrapper = new ChartWrapper(startTime, now)

        onMounted(async () => {
            // 1. loading
            const loading = ElLoading.service({
                target: `#${CONTAINER_ID}`,
            })
            // 2. init chart
            chartWrapper.init(chart.value)
            // 3. query data
            const query: TimerQueryParam = { date: [startTime, now], sort: "date" }
            const items = await timerService.select(query)
            const result = {}
            items.forEach(({ date, focus }) => result[date] = (result[date] || 0) + focus)
            // 4. set weekdays
            // Sunday to Monday
            const weekDays = (t(msg => msg.calendar.weekDays)?.split?.('|') || []).reverse()
            if (!isChinese) {
                // Let Sunday last
                // Saturday to Sunday
                rotate(weekDays, 1)
            }
            // 5. render
            chartWrapper.render(result, weekDays, loading)
        })
        return () => h('div', {
            id: CONTAINER_ID,
            class: 'chart-container',
            ref: chart,
        })
    }
})

export default _default