/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ComposeOption, BarSeriesOption, GridComponentOption, TooltipComponentOption, TitleComponentOption } from "echarts"

import { mergeDate } from "@service/stat-service/merge"
import { t } from "@app/locale"
import { SeriesDataItem, generateTitleOption } from "../common"
import { EchartsWrapper } from "@hooks/useEcharts"
import { getStepColors } from "@app/util/echarts"
import { TopLevelFormatterParams } from "echarts/types/dist/shared"
import { generateSiteLabel } from "@util/site"
import { periodFormatter } from "@app/util/time"

type EcOption = ComposeOption<
    | BarSeriesOption
    | GridComponentOption
    | TooltipComponentOption
    | TitleComponentOption
>

type BizOption = {
    rows: timer.stat.Row[]
    timeFormat: timer.app.TimeFormat
}

const TOP_NUM = 8

const MARGIN_LEFT_P = 8
const MARGIN_RIGHT_P = 8

const formatFocusTooltip = (params: TopLevelFormatterParams, format: timer.app.TimeFormat): string => {
    const param = Array.isArray(params) ? params[0] : params
    const { data } = param || {}
    const { row } = (data as any) || {}
    const { host, alias, focus = 0 } = row || {}
    const siteLabel = host ? generateSiteLabel(host, alias) : (alias || 'Unknown')
    return `
        <div>${siteLabel}</div>
        <div>
            <b>${periodFormatter(focus, { format })}</b>
        </div>
    `
}

async function generateOption(rows: timer.stat.Row[] = [], timeFormat: timer.app.TimeFormat, dom: HTMLElement): Promise<EcOption> {
    const merged = mergeDate(rows)
    const topList = merged.sort((a, b) => b.focus - a.focus).splice(0, TOP_NUM).reverse()
    const max = topList[topList.length - 1]?.focus ?? 0
    const hosts = topList.map(r => r.alias || r.host)

    const domW = dom.getBoundingClientRect().width
    const chartW = domW * (100 - MARGIN_LEFT_P - MARGIN_RIGHT_P) / 100

    const title = t(msg => msg.habit.site.histogramTitle, { n: TOP_NUM })

    return {
        title: generateTitleOption(title),
        grid: {
            left: `${MARGIN_LEFT_P}%`,
            containLabel: true,
            right: `${MARGIN_RIGHT_P}%`,
            top: "16%",
            bottom: '4%',
        },
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            formatter: (params: TopLevelFormatterParams) => formatFocusTooltip(params, timeFormat),
        },
        xAxis: {
            type: "value",
            minInterval: 1,
            axisLabel: { show: false },
            splitLine: { show: false },
            min: 0,
            max: max,
        },
        yAxis: {
            type: "category",
            data: hosts,
            axisLabel: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
            },
        },
        series: {
            type: "bar",
            barWidth: '100%',
            data: topList.map((row, idx) => {
                const isBottom = idx === 0
                const isTop = idx === topList.length - 1
                const { focus: value = 0 } = row || {}
                const labelW = (value / max) * chartW - 8
                return {
                    value, row,
                    label: { show: labelW >= 50, width: labelW },
                    itemStyle: {
                        borderRadius: [
                            isTop ? 5 : 0, isTop ? 5 : 0, 5, isBottom ? 5 : 0
                        ]
                    }
                }
            }),
            label: {
                position: 'insideRight',
                overflow: "truncate",
                ellipsis: '...',
                minMargin: 5,
                padding: [0, 4, 0, 0],
                formatter: (param: any) => {
                    const { row } = (param?.data || {}) as SeriesDataItem
                    const { host, alias } = row
                    return alias || host
                },
            },
            colorBy: 'data',
            color: getStepColors(topList.length, 1.5),
        },
    }
}

export default class Wrapper extends EchartsWrapper<BizOption, EcOption> {
    generateOption = ({ rows, timeFormat }: BizOption) => generateOption(rows, timeFormat, this.getDom())
}
