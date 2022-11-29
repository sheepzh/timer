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
    GridComponentOption,
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
import hostAliasService from "@service/host-alias-service"
import { getPrimaryTextColor, getSecondaryTextColor } from "@util/style"
import { labelOfHostInfo } from "../common"

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
    | GridComponentOption
    | LegendComponentOption
    | TitleComponentOption
    | ToolboxComponentOption
    | TooltipComponentOption
>

const TITLE = t(msg => msg.trend.history.title)
const DEFAULT_SUB_TITLE = t(msg => msg.trend.defaultSubTitle)
const SAVE_AS_IMAGE = t(msg => msg.trend.saveAsImageTitle)

const NUMBER_UNIT = t(msg => msg.trend.history.numberUnit)

const MILL_CONVERTERS: { [timeFormat in timer.app.TimeFormat]: (mill: number) => number } = {
    default: mill => Math.floor(mill / 1000),
    second: mill => Math.floor(mill / 1000),
    minute: mill => mill / 1000 / 60,
    hour: mill => mill / 1000 / 3600
}

function formatTimeOfEchart(params: any, timeFormat: timer.app.TimeFormat): string {
    const format = params instanceof Array ? params[0] : params
    const { seriesName, name, value } = format
    let timeStr = ''
    if (timeFormat === 'second') {
        timeStr = (typeof value === 'number' ? value : 0).toFixed(0) + ' s'
    } else if (timeFormat === 'minute') {
        timeStr = (typeof value === 'number' ? value : 0).toFixed(1) + ' m'
    } else if (timeFormat === 'hour') {
        timeStr = (typeof value === 'number' ? value : 0).toFixed(2) + ' h'
    } else {
        const mills = (typeof value === 'number' ? value : 0) * 1000
        timeStr = formatPeriodCommon(mills)
    }
    return `${seriesName}<br/>${name}&ensp;-&ensp;${timeStr}`
}

function optionOf(
    xAxisData: string[],
    subtext: string,
    timeFormat: timer.app.TimeFormat,
    [focusData, timeData]: [number[], number[]]
) {
    const textColor = getPrimaryTextColor()
    const secondaryTextColor = getSecondaryTextColor()
    const option: EcOption = {
        backgroundColor: 'rgba(0,0,0,0)',
        grid: { top: '100' },
        title: {
            text: TITLE,
            textStyle: { color: textColor },
            subtext,
            subtextStyle: { color: secondaryTextColor },
            left: 'center',
        },
        tooltip: { trigger: 'item' },
        toolbox: {
            feature: {
                saveAsImage: {
                    show: true,
                    title: SAVE_AS_IMAGE,
                    excludeComponents: ['toolbox'],
                    pixelRatio: 1,
                    backgroundColor: '#fff',
                    iconStyle: {
                        borderColor: secondaryTextColor
                    }
                }
            }
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: { color: textColor },
        },
        yAxis: [
            {
                name: t(msg => msg.trend.history.timeUnit[timeFormat || 'default']),
                nameTextStyle: { color: textColor },
                type: 'value',
                axisLabel: { color: textColor },
            },
            {
                name: NUMBER_UNIT,
                nameTextStyle: { color: textColor },
                type: 'value',
                axisLabel: { color: textColor },
            }
        ],
        legend: [{
            left: 'left',
            data: [t(msg => msg.item.total), t(msg => msg.item.focus), t(msg => msg.item.time)],
            textStyle: { color: textColor },
        }],
        series: [{
            name: t(msg => msg.item.focus),
            data: focusData,
            yAxisIndex: 0,
            type: 'line',
            smooth: true,
            tooltip: { formatter: (params: any) => formatTimeOfEchart(params, timeFormat) }
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

async function processSubtitle(host: timer.app.trend.HostInfo) {
    let subtitle = labelOfHostInfo(host)
    if (!subtitle) {
        return DEFAULT_SUB_TITLE
    }
    if (!host.merged) {
        // If not merged, append the site name to the original subtitle
        // @since 0.9.0
        const hostAlias: timer.site.Alias = await hostAliasService.get(host)
        const siteName = hostAlias?.name
        siteName && (subtitle += ` / ${siteName}`)
    }
    return subtitle
}

function processDataItems(allDates: string[], timeFormat: timer.app.TimeFormat, rows: timer.stat.Row[]): [number[], number[]] {
    timeFormat = timeFormat || 'default'
    const millConverter = MILL_CONVERTERS[timeFormat]
    const focusData: number[] = []
    const timeData: number[] = []

    const dateInfoMap: Record<string, timer.stat.Row> = {}
    rows.forEach(row => dateInfoMap[row.date] = row)

    allDates.forEach(date => {
        const row = dateInfoMap[date]
        focusData.push(millConverter(row?.focus || 0))
        timeData.push(row?.time || 0)
    })
    return [focusData, timeData]
}

class ChartWrapper {
    instance: ECharts

    init(container: HTMLDivElement) {
        this.instance = init(container)
    }

    async render(renderOption: timer.app.trend.RenderOption, rows: timer.stat.Row[]) {
        const { host, dateRange, timeFormat } = renderOption
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
        const dataItems = processDataItems(allDates, timeFormat, rows)

        const option: EcOption = optionOf(xAxisData, subtitle, timeFormat, dataItems)
        if (renderOption.isFirst) {
            // Close the running time by default
            const closedLegends: Record<string, boolean> = {}
            closedLegends[t(msg => msg.item.total)] = false
            option.legend[0].selected = closedLegends
        }

        this.instance?.setOption(option)
    }
}

export default ChartWrapper
