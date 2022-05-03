/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { EChartOption, ECharts, EChartTitleOption, init } from "echarts"
import { computed, ComputedRef, defineComponent, h, onMounted, ref, Ref, watch } from "vue"
import { t } from "@app/locale"
import timerService, { TimerQueryParam, SortDirect } from "@service/timer-service"
import { formatPeriodCommon, formatTime, MILL_PER_DAY } from "@util/time"
import HostOptionInfo from "../host-option-info"
import DataItem from "@entity/dto/data-item"
import hostAliasService from "@service/host-alias-service"
import HostAlias from "@entity/dao/host-alias"

// Get the timestamp of one timestamp of date
const timestampOf = (d: Date) => d.getTime()

const mill2Second = (mill: number) => Math.floor((mill || 0) / 1000)

let chartInstance: ECharts
const formatTimeOfEchart = (params: EChartOption.Tooltip.Format | EChartOption.Tooltip.Format[]) => {
    const format: EChartOption.Tooltip.Format = params instanceof Array ? params[0] : params
    const { seriesName, name, value } = format
    return `${seriesName}<br/>${name}&ensp;-&ensp;${formatPeriodCommon((typeof value === 'number' ? value : 0) * 1000)}`
}

const defaultSubTitle = t(msg => msg.trend.defaultSubTitle)

const options: EChartOption<EChartOption.SeriesLine> = {
    backgroundColor: 'rgba(0,0,0,0)',
    grid: { top: '100' },
    title: {
        text: t(msg => msg.trend.history.title),
        subtext: defaultSubTitle,
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    toolbox: {
        feature: {
            saveAsImage: {
                show: true,
                title: t(msg => msg.trend.saveAsImageTitle),
                excludeComponents: ['toolbox'],
                pixelRatio: 1,
                backgroundColor: '#fff'
            }
        }
    },
    xAxis: {
        type: 'category',
        data: []
    },
    yAxis: [
        { name: t(msg => msg.trend.history.timeUnit), type: 'value' },
        { name: t(msg => msg.trend.history.numberUnit), type: 'value' }
    ],
    legend: {
        left: 'left',
        data: [t(msg => msg.item.total), t(msg => msg.item.focus), t(msg => msg.item.time)]
    },
    series: [
        // run time
        {
            name: t(msg => msg.item.total),
            data: [],
            yAxisIndex: 0,
            type: 'line',
            smooth: true,
            tooltip: { formatter: formatTimeOfEchart }
        },
        {
            name: t(msg => msg.item.focus),
            data: [],
            yAxisIndex: 0,
            type: 'line',
            smooth: true,
            tooltip: { formatter: formatTimeOfEchart }
        },
        {
            name: t(msg => msg.item.time),
            data: [],
            yAxisIndex: 1,
            type: 'line',
            smooth: true,
            tooltip: {
                formatter: (params: EChartOption.Tooltip.Format | EChartOption.Tooltip.Format[]) => {
                    const format: EChartOption.Tooltip.Format = params instanceof Array ? params[0] : params
                    const { seriesName, name, value } = format
                    return `${seriesName}<br/>${name}&emsp;-&emsp;${value}`
                }
            }
        }
    ]
}

const renderChart = () => chartInstance && chartInstance.setOption(options, true)

/**
* Get the x-axis of date 
*/
function getAxias(format: string, dateRange: Date[] | undefined) {
    if (!dateRange || !dateRange.length) {
        // @since 0.0.9
        // The dateRange is cleared, return empty data
        return []
    }
    const xAxisData = []
    const startTime = timestampOf(dateRange[0])
    const endTime = timestampOf(dateRange[1])
    for (let time = startTime; time <= endTime; time += MILL_PER_DAY) {
        xAxisData.push(formatTime(time, format))
    }
    return xAxisData
}

/**
 * Update the x-axis
 */
function updateXAxis(hostOptionInfo: HostOptionInfo, dateRange: Date[]) {
    const xAxis: EChartOption.XAxis = options.xAxis as EChartOption.XAxis
    const host = hostOptionInfo.host
    if (!host || !dateRange || dateRange.length !== 2) {
        xAxis.data = []
    }
    xAxis.data = getAxias('{m}/{d}', dateRange)
}


async function queryData(queryParam: TimerQueryParam, host: HostOptionInfo, dateRange: Date[]) {
    const rows: DataItem[] = await timerService.select(queryParam)
    const dateInfoMap = {}
    rows.forEach(row => dateInfoMap[row.date] = row)
    const allXAxis = getAxias('{y}{m}{d}', dateRange)

    const focusData = []
    const totalData = []
    const timeData = []

    allXAxis.forEach(date => {
        const row = dateInfoMap[date] || {}
        focusData.push(mill2Second(row.focus))
        totalData.push(mill2Second(row.total))
        timeData.push(row.time || 0)
    })

    await processSubtitle(host)

    options.series[0].data = totalData
    options.series[1].data = focusData
    options.series[2].data = timeData
    renderChart()
}

async function processSubtitle(host: HostOptionInfo) {
    const titleOption = options.title as EChartTitleOption
    let subtitle = host.toString()
    if (!subtitle) {
        titleOption.subtext = defaultSubTitle
        return
    }
    if (!host.merged) {
        // If not merged, append the site name to the original subtitle
        // @since 0.9.0
        const hostAlias: HostAlias = await hostAliasService.get(host.host)
        const siteName = hostAlias?.name
        siteName && (subtitle += ` / ${siteName}`)
    }
    titleOption.subtext = subtitle
}

const _default = defineComponent({
    name: "TrendChart",
    setup(_, ctx) {
        const chart: Ref<HTMLDivElement> = ref()
        const host: Ref<HostOptionInfo> = ref(HostOptionInfo.empty())
        const dateRange: Ref<Array<Date>> = ref([])

        const queryParam: ComputedRef<TimerQueryParam> = computed(() => {
            return {
                // If the host is empty, no result will be queried with this param.
                host: host.value.host === '' ? '___foo_bar' : host.value.host,
                mergeHost: host.value.merged,
                fullHost: true,
                sort: 'date',
                sortOrder: SortDirect.ASC
            }
        })

        watch(host, () => queryData(queryParam.value, host.value, dateRange.value))
        watch(dateRange, () => {
            updateXAxis(host.value, dateRange.value)
            queryData(queryParam.value, host.value, dateRange.value)
        })

        ctx.expose({
            setDomain: (key: string) => host.value = HostOptionInfo.from(key),
            setDateRange: (newVal: Date[]) => dateRange.value = newVal
        })

        onMounted(() => {
            chartInstance = init(chart.value)
            updateXAxis(host.value, dateRange.value)
            renderChart()
        })

        return () => h('div', { class: 'chart-container', ref: chart })
    }
})

export default _default
