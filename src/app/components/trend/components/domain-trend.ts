import { EChartOption, ECharts, EChartTitleOption, init } from "echarts"
import { ElCard } from "element-plus"
import { computed, ComputedRef, defineComponent, h, onMounted, ref, Ref, SetupContext, watch } from "vue"
import { t } from "../../../locale"
import timerService, { TimerQueryParam, SortDirect } from "../../../../service/timer-service"
import { formatPeriodCommon, formatTime, MILL_PER_DAY } from "../../../../util/time"
import DomainOptionInfo from "../domain-option-info"
import { contentContainerCardStyle } from "../../common/content-container"

// Get the timestamp of one timestamp of date
const timestampOf = (d: Date) => d.getTime()

const mill2Second = (mill: number) => Math.floor((mill || 0) / 1000)

const chartRef: Ref<HTMLDivElement> = ref()
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

const domainRef: Ref<DomainOptionInfo> = ref(DomainOptionInfo.empty())
const dateRangeRef: Ref<Array<Date>> = ref([])

watch(domainRef, () => queryData())
watch(dateRangeRef, () => {
    updateXAxis()
    queryData()
})

/**
* Get the x-axis of date 
*/
const getAxias = (format: string) => {
    const dateRange = dateRangeRef.value
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
const updateXAxis = () => {
    const xAxis: EChartOption.XAxis = options.xAxis as EChartOption.XAxis
    const host = domainRef.value.host
    if (!host || !dateRangeRef.value || dateRangeRef.value.length !== 2) {
        xAxis.data = []
    }
    xAxis.data = getAxias('{m}/{d}')
}

const queryParam: ComputedRef<TimerQueryParam> = computed(() => {
    return {
        // If the domain is empty, no result will be queried with this param.
        host: domainRef.value.host === '' ? '___foo_bar' : domainRef.value.host,
        mergeDomain: domainRef.value.merged,
        fullHost: true,
        sort: 'date',
        sortOrder: SortDirect.ASC
    }
})

const queryData = () => {
    timerService.select(queryParam.value)
        .then(rows => {
            const dateInfoMap = {}
            rows.forEach(row => dateInfoMap[row.date] = row)
            const allXAxis = getAxias('{y}{m}{d}')

            const focusData = []
            const totalData = []
            const timeData = []

            allXAxis.forEach(date => {
                const row = dateInfoMap[date] || {}

                focusData.push(mill2Second(row.focus))
                totalData.push(mill2Second(row.total))
                timeData.push(row.time || 0)
            })

            const titleOption = options.title as EChartTitleOption
            titleOption.subtext = domainRef.value.toString() || defaultSubTitle
            options.series[0].data = totalData
            options.series[1].data = focusData
            options.series[2].data = timeData
            renderChart()
        })
}

const _default = defineComponent((_, context: SetupContext) => {
    context.expose({
        setDomain: (key: string) => domainRef.value = DomainOptionInfo.from(key),
        setDateRange: (dateRange: Date[]) => dateRangeRef.value = dateRange
    })

    onMounted(() => {
        chartInstance = init(chartRef.value)
        updateXAxis()
        renderChart()
    })

    return () => h(ElCard,
        contentContainerCardStyle,
        () => h('div', { class: 'chart-container', ref: chartRef })
    )
})

export default _default