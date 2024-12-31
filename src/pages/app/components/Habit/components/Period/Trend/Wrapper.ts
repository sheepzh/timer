/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { ComposeOption, GridComponentOption, TooltipComponentOption, BarSeriesOption } from "echarts"

import { formatTime } from "@util/time"
import { getPrimaryTextColor } from "@util/style"
import { EchartsWrapper } from "@hooks/useEcharts"
import { getSeriesPalette } from "@app/util/echarts"
import { formatXAxisTime, generateGridOption } from "../common"
import { periodFormatter } from "@app/util/time"

type EcOption = ComposeOption<
    | BarSeriesOption
    | GridComponentOption
    | TooltipComponentOption
>

export type BizOption = {
    data: timer.period.Row[]
    timeFormat: timer.app.TimeFormat
}


function formatTimeOfEcharts(params: any, timeFormat: timer.app.TimeFormat): string {
    const format = Array.isArray(params) ? params[0] : params
    const { value } = format
    const milliseconds = value[1] ?? 0
    const start = formatTime(value[2], '{m}-{d} {h}:{i}')
    const end = formatTime(value[3], '{h}:{i}')
    return `
        <div>${start}-${end}</div>
        <div>
            <b>
                ${periodFormatter(milliseconds, { format: timeFormat })}
            </b>
        </div>
    `
}

type BarItem = BarSeriesOption["data"][number]

const cvt2Item = (row: timer.period.Row): BarItem => {
    const startTime = row.startTime.getTime()
    const endTime = row.endTime.getTime()
    const time = (startTime + endTime) / 2
    const milliseconds = row.milliseconds
    return [time, milliseconds, startTime, endTime]
}

function generateOption({ data, timeFormat }: BizOption): EcOption {
    const seriesData: BarItem[] = data.map(r => cvt2Item(r))
    const color = getSeriesPalette()?.[3]

    const textColor = getPrimaryTextColor()

    return {
        tooltip: {
            formatter: (params: any) => formatTimeOfEcharts(params, timeFormat),
            borderColor: null,
        },
        grid: generateGridOption(),
        xAxis: {
            type: 'time',
            axisLabel: { formatter: formatXAxisTime, color: textColor },
            axisLine: { show: false },
            axisTick: { show: false },
            min: seriesData[0]?.[0],
            max: seriesData[seriesData.length - 1]?.[0],
        },
        yAxis: {
            type: 'value',
            axisLabel: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
        },
        series: {
            type: "bar",
            large: true,
            data: seriesData,
            barCategoryGap: 0,
            itemStyle: { borderWidth: 0 },
            color,
        },
    }
}
export default class Wrapper extends EchartsWrapper<BizOption, EcOption> {
    generateOption = generateOption
}