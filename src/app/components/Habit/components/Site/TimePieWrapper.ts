/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ComposeOption } from "echarts/core"
import type { GridComponentOption, TooltipComponentOption, TitleComponentOption } from "echarts/components"
import type { PieSeriesOption } from "echarts/charts"

import { use } from "echarts/core"
import { PieChart } from "echarts/charts"
import { SVGRenderer } from "echarts/renderers"
import { TooltipComponent, GridComponent, TitleComponent } from "echarts/components"
import { mergeDate } from "@service/stat-service/merge"
import { t } from "@app/locale"
import { MIN_PERCENT_OF_PIE, formatTimeTooltip, generateTitleOption } from "./common"
import { sum } from "@util/array"
import { EchartsWrapper } from "@app/hooks/useEcharts"
import { echartsPalette } from "@util/echarts"

use([PieChart, SVGRenderer, TooltipComponent, GridComponent, TitleComponent])

type EcOption = ComposeOption<
    | GridComponentOption
    | TooltipComponentOption
    | TitleComponentOption
    | PieSeriesOption
>

const generateOption = (rows: timer.stat.Row[]): EcOption => {
    rows = mergeDate(rows).sort((a, b) => b.time - a.time)
    const total = sum(rows.map(r => r.time))
    const realRows: timer.stat.Row[] = []
    const tailRows: timer.stat.Row[] = []
    rows.forEach(r => {
        if (r.time > MIN_PERCENT_OF_PIE * total) {
            realRows.push(r)
        } else {
            tailRows.push(r)
        }
    })
    const leftTime = sum(tailRows.map(r => r.time))
    if (leftTime) {
        const alias = t(msg => msg.habit.site.otherLabel, { count: tailRows.length || 0 })
        realRows.push({ host: null, alias, focus: 0, time: leftTime, mergedHosts: [], virtual: false })
    }
    const title = t(msg => msg.habit.site.visitPieTitle)
    return {
        title: generateTitleOption(title),
        series: [{
            type: "pie",
            center: ["50%", "60%"],
            startAngle: 90,
            data: realRows.map(row => ({ value: row.time, row })),
            label: {
                show: false,
            },
            color: echartsPalette(),
        }],
        tooltip: {
            show: true,
            formatter: (params: [any]) => formatTimeTooltip(params),
        },
    }
}

export default class TimePieWrapper extends EchartsWrapper<timer.stat.Row[], EcOption> {
    generateOption = generateOption
}
