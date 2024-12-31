/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { ComposeOption } from "echarts/core"
import type { PieSeriesOption, BarSeriesOption } from "echarts/charts"
import type { TooltipComponentOption, GridComponentOption } from "echarts/components"

import { EchartsWrapper } from "@hooks/useEcharts"
import { getPrimaryTextColor } from "@util/style"
import { generateSiteLabel } from "@util/site"
import { getSeriesPalette, getStepColors } from "@app/util/echarts"

export const TOP_NUM = 6, DAY_NUM = 30

type EcOption = ComposeOption<
    | PieSeriesOption
    | BarSeriesOption
    | GridComponentOption
    | TooltipComponentOption
>

export type BizOption = {
    name: string
    value: number
    // Extensive info
    host: string
    alias?: string
}

const tooltipOption = (): EcOption['tooltip'] => (
    {
        show: true,
        borderWidth: 0,
        formatter(params: any) {
            const visit = params.data?.value || 0
            const host = params.data?.host || ''
            const alias = params.data?.alias || ''
            const hostLabel = generateSiteLabel(host, alias)
            return `${hostLabel}<br/><b>${visit}</b>`
        }
    }
)

const xsOption = (data: BizOption[], domWidth: number): EcOption => {
    data = data?.sort((a, b) => (b?.value ?? 0) - (a?.value ?? 0))
    const max = Math.max(...(data?.map(v => v.value) || []))
    const hosts = data?.sort((a, b) => (a.value ?? 0) - (b?.value ?? 0))?.map(v => v.host) || []
    const margin = 8
    const chartW = domWidth * (100 - margin * 2) / 100
    return {
        tooltip: tooltipOption(),
        grid: { left: '5%', right: '5%', bottom: '3%', top: '8%', },
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
            axisLabel: { show: false },
            axisTick: { show: false },
            axisLine: { show: false },
        },
        series: {
            type: "bar",
            barWidth: '100%',
            data: data.map((row, idx) => {
                const isBottom = idx === 0
                const isTop = idx === data.length - 1
                const { value = 0 } = row || {}
                const labelW = (value / max) * chartW - 8
                return {
                    ...row,
                    label: { show: labelW >= 50, width: labelW },
                    itemStyle: {
                        borderRadius: [
                            isTop ? 5 : 0, isTop ? 5 : 0, 5, isBottom ? 5 : 0
                        ]
                    },
                }
            }),
            label: {
                position: 'insideRight',
                overflow: "truncate",
                ellipsis: '...',
                minMargin: 5,
                padding: [0, 4, 0, 0],
                formatter: (param: any) => {
                    const { host, name } = (param?.data || {})
                    return name || host
                },
            },
            colorBy: 'data',
            color: getStepColors(data.length, 1.5),
        },
    }
}

const normalOption = (data: BizOption[]): EcOption => {
    const textColor = getPrimaryTextColor()
    return {
        tooltip: tooltipOption(),
        series: {
            top: '10%',
            height: '90%',
            type: 'pie',
            radius: [20, 80],
            center: ['50%', '50%'],
            roseType: 'area',
            color: getSeriesPalette(),
            itemStyle: {
                borderRadius: 7,
            },
            label: { color: textColor },
            data: data,
        }
    }
}

class Wrapper extends EchartsWrapper<BizOption[], EcOption> {
    protected isSizeSensitize: boolean = true

    generateOption(option: BizOption[]) {
        if (!option?.length) return {}
        const domWidth = this.getDomWidth()
        if (!domWidth) return {}
        const isXsScreen = domWidth <= 340
        return isXsScreen ? xsOption(option, domWidth) : normalOption(option)
    }
}

export default Wrapper
