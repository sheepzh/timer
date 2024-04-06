/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { StatQueryParam } from "@service/stat-service"
import type { ComposeOption } from "echarts/core"

import { use } from "echarts/core"
import { BarChart, BarSeriesOption } from "echarts/charts"
import {
    GridComponent, type GridComponentOption,
    TitleComponent, type TitleComponentOption,
    TooltipComponent, type TooltipComponentOption,
    LegendComponent, type LegendComponentOption,
} from "echarts/components"

use([BarChart, GridComponent, TitleComponent, TooltipComponent, LegendComponent])

import { formatPeriodCommon, MILL_PER_DAY } from "@util/time"
import { defineComponent } from "vue"
import statService from "@service/stat-service"
import { groupBy, sum } from "@util/array"
import { BASE_TITLE_OPTION } from "../common"
import { t } from "@app/locale"
import { getPrimaryTextColor } from "@util/style"
import { generateSiteLabel } from "@util/site"
import { useEcharts, EchartsWrapper } from "@hooks/useEcharts"

type EcOption = ComposeOption<
    | BarSeriesOption
    | GridComponentOption
    | TitleComponentOption
    | TooltipComponentOption
    | LegendComponentOption
>

const PERIOD_WIDTH = 7
const TOP_NUM = 10

type _Value = timer.site.SiteInfo & {
    lastPeriod: number
    thisPeriod: number
    delta: number
}

const calcXAxisLabel = (host: string, alias: string, richName: string): string => {
    if (richName) return `{${richName}|}`
    const label = alias || host
    return label?.substring(0, 1)?.toUpperCase?.()
}

const calcXAxiasRich = (values: _Value[]) => {
    const rich = {}
    let idx = 0
    const richNameMap = {}
    values.forEach(({ iconUrl, host }) => {
        if (!iconUrl) return
        const name = `ic${idx++}`
        rich[name] = {
            backgroundColor: {
                image: iconUrl,
            },
            height: 12,
        }
        richNameMap[host] = name
    })
    return [rich, richNameMap]
}

function optionOf(lastPeriodItems: timer.stat.Row[], thisPeriodItems: timer.stat.Row[]): EcOption {
    const textColor = getPrimaryTextColor()

    const hostSiteMap: { [host: string]: Pick<timer.stat.Row, "alias" | "iconUrl" | "host"> } = {
        ...groupBy(lastPeriodItems, item => item.host, grouped => grouped?.[0]),
        ...groupBy(thisPeriodItems, item => item.host, grouped => grouped?.[0])
    }

    const lastPeriodMap: { [host: string]: number } = groupBy(lastPeriodItems,
        item => item.host,
        grouped => Math.floor(sum(grouped.map(item => item.focus)) / 1000)
    )

    const thisPeriodMap: { [host: string]: number } = groupBy(thisPeriodItems,
        item => item.host,
        grouped => Math.floor(sum(grouped.map(item => item.focus)) / 1000)
    )
    const values: Record<string, _Value> = {}
    // 1st, iterate this period
    Object.entries(thisPeriodMap)
        .forEach(([host, thisPeriod]) => {
            const lastPeriod = lastPeriodMap[host] || 0
            const delta = thisPeriod - lastPeriod
            const { iconUrl, alias } = hostSiteMap[host] || {}
            values[host] = { thisPeriod, lastPeriod, delta, host, iconUrl, alias }
        })
    // 2nd, iterate last period
    Object.entries(lastPeriodMap)
        .filter(([host]) => !values[host])
        .forEach(([host, lastPeriod]) => {
            const thisPeriod = thisPeriodMap[host] || 0
            const delta = thisPeriod - lastPeriod
            const { iconUrl, alias } = hostSiteMap[host] || {}
            values[host] = { thisPeriod, lastPeriod, delta, host, iconUrl, alias }
        })
    // 3rd, sort by delta
    const sortedValues = Object.values(values)
        .sort((a, b) => Math.abs(a.delta) - Math.abs(b.delta))
        .reverse()
    const topK = sortedValues.slice(0, TOP_NUM)
    // 4th, sort by max value
    topK.sort((a, b) => Math.max(a.lastPeriod, a.thisPeriod) - Math.max(b.lastPeriod, b.thisPeriod)).reverse()

    const color1 = '#FFC300'
    const color2 = '#E80054'
    const [rich, richNameMap] = calcXAxiasRich(Object.values(topK))
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
                const host = params?.[0]?.axisValue
                const lastPeriod = params?.[0]?.value ?? 0
                const thisPeriod = params?.[1]?.value ?? 0
                const lastLabel = t(msg => msg.dashboard.weekOnWeek.lastBrowse, { time: formatPeriodCommon(lastPeriod * 1000) })
                const thisLabel = t(msg => msg.dashboard.weekOnWeek.thisBrowse, { time: formatPeriodCommon(thisPeriod * 1000) })
                const deltaLabel = t(msg => msg.dashboard.weekOnWeek.wow, {
                    delta: formatPeriodCommon(Math.abs(thisPeriod - lastPeriod) * 1000),
                    state: t(msg => msg.dashboard.weekOnWeek[thisPeriod < lastPeriod ? 'decline' : 'increase'])
                })
                const siteLabel = generateSiteLabel(host, hostSiteMap[host]?.alias)
                return `${siteLabel}<br/>${lastLabel}<br/>${thisLabel}<br/>${deltaLabel}`
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '10%',
            top: '8%',
        },
        xAxis: {
            type: 'category',
            splitLine: { show: false },
            axisTick: { show: false },
            axisLine: { show: false },
            data: topK.map(a => a.host),
            axisLabel: {
                interval: 0,
                color: textColor,
                rich,
                formatter: host => calcXAxisLabel(host, hostSiteMap[host]?.alias, richNameMap[host])
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: { show: false },
            splitLine: { show: false },
        },
        series: [
            {
                name: "Last Week",
                type: 'bar',
                barMaxWidth: '25px',
                itemStyle: { color: color1, borderRadius: 10 },
                data: topK.map(a => a.lastPeriod),
            }, {
                name: "This Week",
                type: 'bar',
                barMaxWidth: '25px',
                itemStyle: { color: color2, borderRadius: 10 },
                data: topK.map(a => a.thisPeriod)
            }
        ],
        legend: {
            right: '4%',
            top: BASE_TITLE_OPTION.top,
            textStyle: { color: textColor },
            itemGap: 12,
        },
    }
}

class ChartWrapper extends EchartsWrapper<timer.stat.Row[][], EcOption> {
    generateOption = ([lastPeriodItems, thisPeriodItems]) => optionOf(lastPeriodItems, thisPeriodItems)
}

const fetchData = async (): Promise<timer.stat.Row[][]> => {
    const now = new Date()
    const lastPeriodStart = new Date(now.getTime() - MILL_PER_DAY * PERIOD_WIDTH * 2)
    const lastPeriodEnd = new Date(lastPeriodStart.getTime() + MILL_PER_DAY * (PERIOD_WIDTH - 1))
    const thisPeriodStart = new Date(now.getTime() - MILL_PER_DAY * PERIOD_WIDTH)
    // Not includes today
    const thisPeriodEnd = new Date(now.getTime() - MILL_PER_DAY)
    const query: StatQueryParam = {
        date: [lastPeriodStart, lastPeriodEnd],
        mergeDate: true,
    }
    // Query with alias
    // @since 1.1.8
    const lastPeriodItems: timer.stat.Row[] = await statService.select(query, true)
    query.date = [thisPeriodStart, thisPeriodEnd]
    const thisPeriodItems: timer.stat.Row[] = await statService.select(query, true)
    return [lastPeriodItems, thisPeriodItems]
}

const _default = defineComponent(() => {
    const { elRef } = useEcharts(ChartWrapper, fetchData)
    return () => <div class="chart-container" ref={elRef} />
})

export default _default