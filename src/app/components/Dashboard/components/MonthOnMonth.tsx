/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ComposeOption } from "echarts/core"
import type { TopLevelFormatterParams } from "echarts/types/dist/shared"

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
import DateIterator from "@util/date-iterator"
import { cvt2LocaleTime } from "@app/util/time"
import { getCompareColor, getDiffColor, tooltipDot } from "@app/util/echarts"
import { EchartsWrapper, useEcharts } from "@hooks/useEcharts"

type EcOption = ComposeOption<
    | BarSeriesOption
    | GridComponentOption
    | TitleComponentOption
    | TooltipComponentOption
    | LegendComponentOption
>

const PERIOD_WIDTH = 30
const TOP_NUM = 15

type _Value = {
    value: number
    row: Row
}

function optionOf(lastPeriodItems: Row[], thisPeriodItems: Row[]): EcOption {
    const textColor = getPrimaryTextColor()

    const [color1, color2] = getCompareColor()
    const [incColor, decColor] = getDiffColor()

    return {
        title: {
            ...BASE_TITLE_OPTION,
            text: t(msg => msg.dashboard.monthOnMonth.title, { k: TOP_NUM }),
            textStyle: {
                color: textColor,
                fontSize: '14px',
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter(params: TopLevelFormatterParams) {
                if (!Array.isArray(params)) return ''
                const [thisItem, lastItem] = params.map(v => v.data as _Value).map(v => v.row) || []
                const [thisColor, lastColor] = params.map(v => v.color)
                const { date: thisDate, total: thisVal } = thisItem || {}
                const { date: lastDate, total: lastVal } = lastItem || {}
                const lastStr = `${tooltipDot(lastColor as string)}&emsp;${cvt2LocaleTime(lastDate)}&emsp;<b>${formatPeriodCommon(lastVal)}</b>`
                let thisStr = `${tooltipDot(thisColor as string)}&emsp;${cvt2LocaleTime(thisDate)}&emsp;<b>${formatPeriodCommon(thisVal)}</b>`
                if (lastVal) {
                    const delta = (thisVal - lastVal) / lastVal * 100
                    let deltaStr = delta.toFixed(1) + '%'
                    if (delta >= 0) deltaStr = '+' + deltaStr
                    const fontColor = delta >= 0 ? incColor : decColor
                    thisStr += `&emsp;<font style="color: ${fontColor};">${deltaStr}</font>`
                }
                return `${thisStr}<br/>${lastStr}`
            },
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '3%',
            top: '11%',
        },
        xAxis: {
            type: 'category',
            splitLine: { show: false },
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: { show: false },
        },
        yAxis: [
            {
                type: 'value',
                axisLabel: { show: false },
                splitLine: { show: false },
            }
        ],
        series: [
            {
                name: "This Month",
                stack: "one",
                type: 'bar',
                barCategoryGap: '55%',
                itemStyle: { color: color1, borderRadius: [10, 10, 0, 0] },
                data: thisPeriodItems.map(row => ({ value: row.total, row })),
            }, {
                name: "Last Month",
                stack: "one",
                type: 'bar',
                itemStyle: { color: color2, borderRadius: [0, 0, 10, 10] },
                data: lastPeriodItems.map(row => ({ value: -row.total, row })),
            }
        ],
    }
}

class ChartWrapper extends EchartsWrapper<[Row[], Row[]], EcOption> {
    generateOption = ([lastPeriodItems, thisPeriodItems]) => optionOf(lastPeriodItems, thisPeriodItems)
}

type Row = {
    date: string
    total: number
}

const cvtRow = (rows: timer.stat.Row[], start: Date, end: Date): Row[] => {
    const groupByDate = groupBy(rows, r => r.date, l => sum(l.map(e => e.focus ?? 0)))
    const iterator = new DateIterator(start, end)
    const result: Row[] = []
    iterator.forEach(yearMonthDate => {
        const total = groupByDate[yearMonthDate] ?? 0
        result.push({ total, date: yearMonthDate })
    })
    return result
}

const fetchData = async (): Promise<[thisMonth: Row[], lastMonth: Row[]]> => {
    const now = new Date()
    const lastPeriodStart = new Date(now.getTime() - MILL_PER_DAY * (PERIOD_WIDTH * 2 - 1))
    const lastPeriodEnd = new Date(now.getTime() - MILL_PER_DAY * PERIOD_WIDTH)
    const thisPeriodStart = new Date(now.getTime() - MILL_PER_DAY * (PERIOD_WIDTH - 1))
    const thisPeriodEnd = now

    // Query with alias
    // @since 1.1.8
    const lastPeriodItems: timer.stat.Row[] = await statService.select({ date: [lastPeriodStart, lastPeriodEnd] }, true)
    const lastRows = cvtRow(lastPeriodItems, lastPeriodStart, lastPeriodEnd)
    const thisPeriodItems: timer.stat.Row[] = await statService.select({ date: [thisPeriodStart, thisPeriodEnd] }, true)
    const thisRows = cvtRow(thisPeriodItems, thisPeriodStart, thisPeriodEnd)
    return [lastRows, thisRows]
}

const _default = defineComponent(() => {
    const { elRef } = useEcharts(ChartWrapper, fetchData)
    return () => <div class="chart-container" ref={elRef} />
})

export default _default