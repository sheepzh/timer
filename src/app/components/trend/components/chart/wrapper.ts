/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ECharts, ComposeOption } from "echarts/core"
import type { LineSeriesOption } from "echarts/charts"
import type {
    GraphicComponentOption,
    LegendComponentOption,
    TitleComponentOption,
    TooltipComponentOption,
    ToolboxComponentOption,
} from "echarts/components"

import { init, use } from "@echarts/core"
import LineChart from "@echarts/chart/line"
import GridComponent from "@echarts/component/grid"
import CanvasRenderer from "@echarts/canvas-renderer"
import LegendComponent from "@echarts/component/legend"
import TitleComponent from "@echarts/component/title"
import ToolboxComponent from "@echarts/component/toolbox"
import TooltipComponent from "@echarts/component/tooltip"

import { t } from "@app/locale"
import { formatPeriodCommon, formatTime, MILL_PER_DAY } from "@util/time"
import HostOptionInfo from "../../host-option-info"
import DataItem from "@entity/dto/data-item"
import hostAliasService from "@service/host-alias-service"
import HostAlias from "@entity/dao/host-alias"

use([
    LineChart,
    GridComponent,
    LegendComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    CanvasRenderer,
])

type EcOption = ComposeOption<
    | LineSeriesOption
    | GraphicComponentOption
    | LegendComponentOption
    | TitleComponentOption
    | ToolboxComponentOption
    | TooltipComponentOption
>

const TITLE = t(msg => msg.trend.history.title)
const DEFAULT_SUB_TITLE = t(msg => msg.trend.defaultSubTitle)
const SAVE_AS_IMAGE = t(msg => msg.trend.saveAsImageTitle)

const TIME_UNIT = t(msg => msg.trend.history.timeUnit)
const NUMBER_UNIT = t(msg => msg.trend.history.numberUnit)

function formatTimeOfEchart(params: any): string {
    const format = params instanceof Array ? params[0] : params
    const { seriesName, name, value } = format
    return `${seriesName}<br/>${name}&ensp;-&ensp;${formatPeriodCommon((typeof value === 'number' ? value : 0) * 1000)}`
}

const mill2Second = (mill: number) => Math.floor((mill || 0) / 1000)

function optionOf(
    xAxisData: string[],
    subtext: string,
    [focusData, totalData, timeData]: number[][]
) {
    const option: EcOption = {
        backgroundColor: 'rgba(0,0,0,0)',
        grid: { top: '100' },
        title: { text: TITLE, subtext, left: 'center' },
        tooltip: { trigger: 'item' },
        toolbox: {
            feature: {
                saveAsImage: {
                    show: true,
                    title: SAVE_AS_IMAGE,
                    excludeComponents: ['toolbox'],
                    pixelRatio: 1,
                    backgroundColor: '#fff'
                }
            }
        },
        xAxis: { type: 'category', data: xAxisData },
        yAxis: [
            { name: TIME_UNIT, type: 'value' },
            { name: NUMBER_UNIT, type: 'value' }
        ],
        legend: {
            left: 'left',
            data: [t(msg => msg.item.total), t(msg => msg.item.focus), t(msg => msg.item.time)]
        },
        series: [{
            // run time
            name: t(msg => msg.item.total),
            data: totalData,
            yAxisIndex: 0,
            type: 'line',
            smooth: true,
            tooltip: { formatter: formatTimeOfEchart }
        }, {
            name: t(msg => msg.item.focus),
            data: focusData,
            yAxisIndex: 0,
            type: 'line',
            smooth: true,
            tooltip: { formatter: formatTimeOfEchart }
        }, {
            name: t(msg => msg.item.time),
            data: timeData,
            yAxisIndex: 1,
            type: 'line',
            smooth: true,
            tooltip: {
                formatter: (params: any) => {
                    const format = params instanceof Array ? params[0] : params
                    const { seriesName, name, value } = format
                    return `${seriesName}<br/>${name}&emsp;-&emsp;${value}`
                }
            }
        }]
    }
    return option
}


// Get the timestamp of one timestamp of date
const timestampOf = (d: Date) => d.getTime()

/**
* Get the x-axis of date 
*/
function getAxias(format: string, dateRange: Date[] | undefined): string[] {
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

async function processSubtitle(host: HostOptionInfo) {
    let subtitle = host?.toString()
    if (!subtitle) {
        return DEFAULT_SUB_TITLE
    }
    if (!host.merged) {
        // If not merged, append the site name to the original subtitle
        // @since 0.9.0
        const hostAlias: HostAlias = await hostAliasService.get(host.host)
        const siteName = hostAlias?.name
        siteName && (subtitle += ` / ${siteName}`)
    }
    return subtitle
}

class ChartWrapper {
    instance: ECharts

    init(container: HTMLDivElement) {
        this.instance = init(container)
    }

    async render(host: HostOptionInfo, dateRange: Date[], row: DataItem[]) {
        // 1. x-axis data
        let xAxisData: string[], allDates: string[]
        if (!dateRange || dateRange.length !== 2) {
            xAxisData = []
            allDates = []
        } else {
            xAxisData = getAxias('{m}/{d}', dateRange)
            allDates = getAxias('{y}{m}{d}', dateRange)
        }

        // 2. subtitle
        const subtitle = await processSubtitle(host)

        // 3. series data
        const focusData = []
        const totalData = []
        const timeData = []

        const dateInfoMap = {}
        row.forEach(row => dateInfoMap[row.date] = row)

        allDates.forEach(date => {
            const row = dateInfoMap[date] || {}
            focusData.push(mill2Second(row.focus))
            totalData.push(mill2Second(row.total))
            timeData.push(row.time || 0)
        })

        const option: EcOption = optionOf(xAxisData, subtitle, [focusData, totalData, timeData])

        this.instance?.setOption(option)
    }
}

export default ChartWrapper
