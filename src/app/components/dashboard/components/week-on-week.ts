/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { Ref } from "vue"
import type { TimerQueryParam } from "@service/timer-service"
import type { ECharts } from "echarts/core"

import { init, use, ComposeOption } from "echarts/core"
import { CandlestickChart, CandlestickSeriesOption } from "echarts/charts"
import {
    GridComponent, GridComponentOption,
    TitleComponent, TitleComponentOption,
    TooltipComponent, TooltipComponentOption,
} from "echarts/components"

use([CandlestickChart, GridComponent, TitleComponent, TooltipComponent])

import { formatPeriodCommon, MILL_PER_DAY } from "@util/time"
import { ElLoading } from "element-plus"
import { defineComponent, h, onMounted, ref } from "vue"
import timerService from "@service/timer-service"
import DataItem from "@entity/dto/data-item"
import { groupBy, sum } from "@util/array"
import { BASE_TITLE_OPTION } from "../common"
import { t } from "@app/locale"

type EcOption = ComposeOption<
    | CandlestickSeriesOption
    | GridComponentOption
    | TitleComponentOption
    | TooltipComponentOption
>

const PERIOD_WIDTH = 7

const TOP_NUM = 5

const CONTAINER_ID = '__timer_dashboard_week_on_week'

type _Value = {
    lastPeriod: number
    thisPeriod: number
    delta: number
    host: string
}

function optionOf(lastPeriodItems: DataItem[], thisPeriodItems: DataItem[]): EcOption {
    const lastPeriodMap: { [host: string]: number } = groupBy(lastPeriodItems,
        item => item.host,
        grouped => Math.floor(sum(grouped.map(item => item.focus)) / 1000)
    )

    const thisPeriodMap: { [host: string]: number } = groupBy(thisPeriodItems,
        item => item.host,
        grouped => Math.floor(sum(grouped.map(item => item.focus)) / 1000)
    )
    const values: { [host: string]: _Value } = {}
    // 1st, iterate this period
    Object.entries(thisPeriodMap)
        .forEach(([host, thisPeriod]) => {
            const lastPeriod = lastPeriodMap[host] || 0
            const delta = thisPeriod - lastPeriod
            values[host] = { thisPeriod, lastPeriod, delta, host }
        })
    // 2nd, iterate last period
    Object.entries(lastPeriodMap)
        .filter(([host]) => !values[host])
        .forEach(([host, lastPeriod]) => {
            const thisPeriod = thisPeriodMap[host] || 0
            const delta = thisPeriod - lastPeriod
            values[host] = { thisPeriod, lastPeriod, delta, host }
        })
    // 3rd, sort by delta
    const sortedValues = Object.values(values)
        .sort((a, b) => Math.abs(a.delta) - Math.abs(b.delta))
        .reverse()
    const topK = sortedValues.slice(0, TOP_NUM)
    // 4th, sort by max value
    topK.sort((a, b) => Math.max(a.lastPeriod, a.thisPeriod) - Math.max(b.lastPeriod, b.thisPeriod))

    const positiveColor = getComputedStyle(document.body).getPropertyValue('--el-color-danger')
    const negativeColor = getComputedStyle(document.body).getPropertyValue('--timer-dashboard-heatmap-color-c')
    return {
        title: {
            ...BASE_TITLE_OPTION,
            text: t(msg => msg.dashboard.weekOnWeek.title, { k: TOP_NUM })
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter(params: any) {
                const data = params?.[0]?.data
                const lastPeriod = data[1] || 0
                const thisPeriod = data[2] || 0
                const lastLabel = t(msg => msg.dashboard.weekOnWeek.lastBrowse, { time: formatPeriodCommon(lastPeriod * 1000) })
                const thisLabel = t(msg => msg.dashboard.weekOnWeek.thisBrowse, { time: formatPeriodCommon(thisPeriod * 1000) })
                const deltaLabel = t(msg => msg.dashboard.weekOnWeek.wow, {
                    delta: formatPeriodCommon(Math.abs(thisPeriod - lastPeriod) * 1000),
                    state: t(msg => msg.dashboard.weekOnWeek[thisPeriod < lastPeriod ? 'decline' : 'increase'])
                })
                return `${lastLabel}<br/>${thisLabel}<br/>${deltaLabel}`
            }
        },
        grid: {
            left: '7%',
            right: '3%',
            bottom: '12%',
        },
        xAxis: {
            type: 'category',
            name: 'Seconds',
            splitLine: { show: false },
            data: topK.map(a => a.host),
            axisLabel: {
                interval: 0
            },
        },
        yAxis: {
            type: 'value',
        },
        series: [{
            type: 'candlestick',
            barMaxWidth: '40px',
            itemStyle: {
                color: positiveColor,
                borderColor: positiveColor,
                borderColor0: negativeColor,
                color0: negativeColor,
            },
            data: topK.map(a => [a.lastPeriod, a.thisPeriod, a.lastPeriod, a.thisPeriod])
        }]
    }
}

class ChartWrapper {
    instance: ECharts

    init(container: HTMLDivElement) {
        this.instance = init(container)
    }

    render(option: EcOption, loading: { close: () => void }) {
        this.instance.setOption(option)
        loading.close()
    }
}

const _default = defineComponent({
    name: "WeekOnWeek",
    setup() {
        const now = new Date()
        const lastPeriodStart = new Date(now.getTime() - MILL_PER_DAY * PERIOD_WIDTH * 2)
        const lastPeriodEnd = new Date(lastPeriodStart.getTime() + MILL_PER_DAY * (PERIOD_WIDTH - 1))
        const thisPeriodStart = new Date(now.getTime() - MILL_PER_DAY * PERIOD_WIDTH)
        // Not includes today
        const thisPeriodEnd = new Date(now.getTime() - MILL_PER_DAY)

        const chartWrapper: ChartWrapper = new ChartWrapper()
        const chart: Ref<HTMLDivElement> = ref()
        onMounted(async () => {
            const loading = ElLoading.service({
                target: `#${CONTAINER_ID}`,
            })
            chartWrapper.init(chart.value)
            const query: TimerQueryParam = {
                date: [lastPeriodStart, lastPeriodEnd],
                mergeDate: true,
            }
            const lastPeriodItems: DataItem[] = await timerService.select(query)
            query.date = [thisPeriodStart, thisPeriodEnd]
            const thisPeriodItems: DataItem[] = await timerService.select(query)
            const option = optionOf(lastPeriodItems, thisPeriodItems)
            chartWrapper.render(option, loading)
        })
        return () => h('div', {
            id: CONTAINER_ID,
            class: 'chart-container',
            ref: chart,
        })
    }
})

export default _default