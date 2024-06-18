/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { EchartsWrapper } from "@hooks"
import { use, type ComposeOption } from "echarts/core"
import { CandlestickChart, type CandlestickSeriesOption } from "echarts/charts"
import type { GridComponentOption, TitleComponentOption, TooltipComponentOption } from "echarts/components"
import { GridComponent, TitleComponent, TooltipComponent } from "echarts/components"
import { getPrimaryTextColor } from "@util/style"
import { groupBy, sum } from "@util/array"
import { formatPeriodCommon } from "@util/time"
import { t } from "@app/locale"
import { generateSiteLabel } from "@util/site"
import { BASE_TITLE_OPTION } from "../../common"

use([CandlestickChart, GridComponent, TitleComponent, TooltipComponent])

type EcOption = ComposeOption<
    | CandlestickSeriesOption
    | GridComponentOption
    | TitleComponentOption
    | TooltipComponentOption
>

type _Value = {
    lastPeriod: number
    thisPeriod: number
    delta: number
    host: string
}

const TOP_NUM = 5
const X_AXIS_LABEL_MAX_LENGTH = 16

function calculateXAxisLabel(host: string, hostAliasMap: Record<string, string>) {
    const originLabel = hostAliasMap[host] || host
    const originLength = originLabel?.length
    if (!originLength || originLength <= X_AXIS_LABEL_MAX_LENGTH) {
        return originLabel
    }
    return originLabel.substring(0, X_AXIS_LABEL_MAX_LENGTH - 3) + '...'
}

function optionOf(lastPeriodItems: timer.stat.Row[], thisPeriodItems: timer.stat.Row[]): EcOption {
    const textColor = getPrimaryTextColor()

    const hostAliasMap: { [host: string]: string } = {
        ...groupBy(lastPeriodItems, item => item.host, grouped => grouped?.[0]?.alias),
        ...groupBy(thisPeriodItems, item => item.host, grouped => grouped?.[0]?.alias)
    }

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

    const positiveColor = getComputedStyle(document.body).getPropertyValue('--timer-chart-increase-color')
    const negativeColor = getComputedStyle(document.body).getPropertyValue('--timer-chart-decrease-color')
    return {
        title: {
            ...BASE_TITLE_OPTION,
            text: t(msg => msg.dashboard.weekOnWeek.title, { k: TOP_NUM }),
            textStyle: {
                color: textColor,
                fontSize: '14px',
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter(params: any) {
                const data = params?.[0]?.data
                const host = params?.[0]?.axisValue
                const lastPeriod = data[1] || 0
                const thisPeriod = data[2] || 0
                const lastLabel = t(msg => msg.dashboard.weekOnWeek.lastBrowse, { time: formatPeriodCommon(lastPeriod * 1000) })
                const thisLabel = t(msg => msg.dashboard.weekOnWeek.thisBrowse, { time: formatPeriodCommon(thisPeriod * 1000) })
                const deltaLabel = t(msg => msg.dashboard.weekOnWeek.wow, {
                    delta: formatPeriodCommon(Math.abs(thisPeriod - lastPeriod) * 1000),
                    state: t(msg => msg.dashboard.weekOnWeek[thisPeriod < lastPeriod ? 'decline' : 'increase'])
                })
                const siteLabel = generateSiteLabel(host, hostAliasMap[host])
                return `${siteLabel}<br/>${lastLabel}<br/>${thisLabel}<br/>${deltaLabel}`
            }
        },
        grid: {
            left: '7%',
            right: '3%',
            bottom: '12%',
        },
        xAxis: {
            type: 'category',
            splitLine: { show: false },
            data: topK.map(a => a.host),
            axisLabel: {
                interval: 0,
                color: textColor,
                formatter: (host: string) => calculateXAxisLabel(host, hostAliasMap)
            },
            axisTick: {
                show: false,
            }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: false,
            },
            axisLabel: {
                color: textColor,
            },
            axisLine: {
                show: true,
            }
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


export default class WeekOnWeekWrapper extends EchartsWrapper<timer.stat.Row[][], EcOption> {
    generateOption = ([lastPeriodItems, thisPeriodItems]) => optionOf(lastPeriodItems, thisPeriodItems)
}
