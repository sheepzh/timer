/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { DimensionEntry } from "../../../util"
import type { ComposeOption } from "echarts/core"
import type { LineSeriesOption } from "echarts/charts"
import type {
    TitleComponentOption,
    TooltipComponentOption,
    GridComponentOption,
} from "echarts/components"

import { use } from "echarts/core"
import { LineChart } from "echarts/charts"
import { SVGRenderer } from "echarts/renderers"
import { TitleComponent, TooltipComponent, GridComponent } from "echarts/components"

import { ValueFormatter } from "@app/components/Analysis/util"
import { getSecondaryTextColor } from "@util/style"
import { EchartsWrapper } from "@hooks"
import { ZRColor } from "echarts/types/dist/shared"

use([
    LineChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    SVGRenderer,
])

type EcOption = ComposeOption<
    | LineSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
>

type BizOption = {
    entries: DimensionEntry[]
    preEntries: DimensionEntry[]
    title: string
    valueFormatter: ValueFormatter
}

type ValueItem = LineSeriesOption["data"][0] & {
    _data: DimensionEntry
}

const THIS_COLOR: ZRColor = {
    type: "linear",
    x: 0, y: 0,
    x2: 0, y2: 1,
    colorStops: [
        { offset: 0, color: 'rgb(55, 162, 255)' },
        { offset: 1, color: 'rgb(116, 21, 219)' },
    ],
}
const PREV_COLOR: ZRColor = {
    type: "linear",
    x: 0, y: 0,
    x2: 0, y2: 1,
    colorStops: [
        { offset: 0, color: 'rgb(255, 0, 135)' },
        { offset: 1, color: 'rgb(135, 0, 157)' },
    ],
}

const createTooltipLine = (param: any, valueFormatter: ValueFormatter) => {
    const data = param.data as ValueItem
    const { _data: { value, date } } = data
    const color = param.color as string
    const p = document.createElement('p')
    p.style.margin = "0"
    p.style.padding = "0"
    p.style.alignItems = "center"
    p.style.display = "flex"

    const dotEl = document.createElement('div')
    dotEl.style.width = '8px'
    dotEl.style.height = '8px'
    dotEl.style.display = 'inline-flex'
    dotEl.style.borderRadius = '4px'
    dotEl.style.backgroundColor = color
    dotEl.style.marginRight = '7px'
    p.append(dotEl)

    const dateEl = document.createElement('span')
    dateEl.innerText = date
    dateEl.style.marginRight = "7px"
    p.appendChild(dateEl)

    const valStr = valueFormatter?.(value) || value?.toString() || "NaN"
    const valEL = document.createElement('span')
    valEL.innerText = valStr
    valEL.style.fontWeight = "500"
    p.appendChild(valEL)
    return p
}

const formatTooltip = (params: any[], valueFormatter: ValueFormatter) => {
    const container = document.createElement('div')
    container.style.height = "50px"
    container.style.display = "flex"
    container.style.flexDirection = "column"
    container.style.justifyContent = "space-around"

    const lines = params.map(param => createTooltipLine(param, valueFormatter))
    lines.forEach(l => container.append(l))
    return container
}

const generateOption = ({ entries, preEntries, title, valueFormatter }: BizOption) => {
    const thisExistData = entries?.some(e => !!e.value)
    const prevExistData = preEntries?.some(e => !!e.value)
    const thisPeriod: ValueItem[] = entries?.map(r => ({ name: r.date, value: r.value, _data: r }))
    const prevPeriod: ValueItem[] = preEntries?.map(r => ({ name: r.date, value: r.value, _data: r }))

    const secondaryTextColor = getSecondaryTextColor()
    const option: EcOption = {
        backgroundColor: 'rgba(0,0,0,0)',
        title: {
            text: title,
            textStyle: {
                color: secondaryTextColor,
                fontSize: '14px',
                fontWeight: 'normal',
            },
            left: 'center',
            top: '9%',
        },
        grid: {
            top: '30%',
            bottom: '10px',
            left: '5%',
            right: '5%',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: "line" },
            formatter: (params: any[]) => formatTooltip(params, valueFormatter),
        },
        xAxis: {
            type: 'category',
            data: entries?.map((_, idx) => ({ value: idx, textStyle: { width: 0, opacity: 0 } })),
            show: false,
        },
        yAxis: {
            type: 'value',
            axisLabel: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
        },
        series: [{
            data: prevPeriod,
            type: 'line',
            showSymbol: false,
            smooth: true,
            lineStyle: { width: prevExistData ? 0 : 1 },
            color: PREV_COLOR.colorStops[0].color,
            areaStyle: { opacity: .5, color: PREV_COLOR },
            emphasis: { focus: "self" },
        }, {
            data: thisPeriod,
            type: 'line',
            showSymbol: false,
            smooth: true,
            lineStyle: { width: thisExistData ? 0 : 1 },
            color: THIS_COLOR.colorStops[0].color,
            areaStyle: { color: THIS_COLOR },
            emphasis: { focus: "series" },
        }]
    }
    return option
}

export default class Wrapper extends EchartsWrapper<BizOption, EcOption> {
    generateOption = generateOption
}
