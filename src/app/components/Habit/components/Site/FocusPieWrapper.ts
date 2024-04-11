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
import { MIN_PERCENT_OF_PIE, formatFocusTooltip, generateTitleOption } from "./common"
import { sum } from "@util/array"
import { EchartsWrapper } from "@hooks"
import { echartsPalette } from "@util/echarts"

use([PieChart, SVGRenderer, TooltipComponent, GridComponent, TitleComponent])

type EcOption = ComposeOption<
    | GridComponentOption
    | TooltipComponentOption
    | TitleComponentOption
    | PieSeriesOption
>

type BizOption = {
    rows: timer.stat.Row[]
    timeFormat: timer.app.TimeFormat
}

const generateOption = ({ rows, timeFormat }: BizOption): EcOption => {
    rows = mergeDate(rows).sort((a, b) => b.focus - a.focus)
    const total = sum(rows.map(r => r.focus))
    const realRows: timer.stat.Row[] = []
    const tailRows: timer.stat.Row[] = []
    rows.forEach(r => {
        if (r.focus > MIN_PERCENT_OF_PIE * total) {
            realRows.push(r)
        } else {
            tailRows.push(r)
        }
    })
    const leftFocus = sum(tailRows.map(r => r.focus))
    if (leftFocus) {
        const alias = t(msg => msg.habit.site.otherLabel, { count: tailRows.length || 0 })
        realRows.push({ host: null, alias, focus: leftFocus, time: 0, mergedHosts: [], virtual: false })
    }
    const title = t(msg => msg.habit.site.focusPieTitle)
    return {
        title: generateTitleOption(title),
        series: [{
            type: "pie",
            center: ["50%", "60%"],
            startAngle: 90,
            data: realRows.map(row => ({ value: row.focus, row })),
            label: {
                show: false,
            },
            color: echartsPalette(),
        }],
        tooltip: {
            show: true,
            formatter: (params: [any]) => formatFocusTooltip(params, timeFormat, { splitLine: true })
        },
    }
}

export default class FocusPieWrapper extends EchartsWrapper<BizOption, EcOption> {
    generateOption = generateOption
}
