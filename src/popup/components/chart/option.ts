/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ComposeOption } from "echarts/core"
import type { PieSeriesOption } from "echarts/charts"
import type {
    TitleComponentOption,
    ToolboxComponentOption,
    TooltipComponentOption,
    LegendComponentOption,
} from "echarts/components"
import type QueryResult from "@popup/common/query-result"

import DataItem from "@entity/dto/data-item"
import { formatPeriodCommon, formatTime } from "@util/time"
import { t } from "@popup/locale"

type EcOption = ComposeOption<
    | PieSeriesOption
    | TitleComponentOption
    | ToolboxComponentOption
    | TooltipComponentOption
    | LegendComponentOption
>

const today = formatTime(new Date(), '{y}_{m}_{d}')

/**
 * If the percentage of target site is less than SHOW_ICON_THRESHOLD, don't show its icon
 */
const LABEL_FONT_SIZE = 13
const LABEL_ICON_SIZE = 13

const app = t(msg => msg.appName)

const legend2LabelStyle = (legend: string) => {
    const code = []
    for (let i = 0; i < legend.length; i++) {
        code.push(legend.charCodeAt(i).toString(36).padStart(3, '0'))
    }
    return code.join('')
}

const toolTipFormatter = ({ type }: QueryResult, params: any) => {
    const format = params instanceof Array ? params[0] : params
    const { name, value, percent } = format
    const data = format.data as DataItem
    const host = data.host
    let dimensionName = name
    if (host && host !== name) {
        dimensionName = `${name} (${host})`
    }
    const valueText = type === 'time' ? value || 0 : formatPeriodCommon(typeof value === 'number' ? value as number : 0)
    return `${dimensionName}<br/>${valueText} (${percent}%)`
}

const staticOptions: EcOption = {
    tooltip: {
        trigger: 'item'
    },
    legend: {
        type: 'scroll',
        orient: 'vertical',
        left: 15,
        top: 20,
        bottom: 20,
    },
    series: [{
        name: "Wasted Time",
        type: "pie",
        radius: "55%",
        center: ["64%", "52%"],
        startAngle: 300,
        data: [],
        emphasis: {
            itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
            },
        }
    }],
    toolbox: {
        show: true,
        feature: {
            restore: {
                show: true,
                title: t(msg => msg.restoreTitle)
            },
            saveAsImage: {
                show: true,
                title: t(msg => msg.saveAsImageTitle),
                name: t(msg => msg.fileName, { app, today }), // file name
                excludeComponents: ['toolbox'],
                pixelRatio: 1
            }
        }
    }
}

const maxWidth = 750

function calcPositionOfTooltip(container: HTMLDivElement, point: (number | string)[]) {
    let p: number | string = point[0]
    const pN: number = typeof p === 'number' ? p : Number.parseFloat(p)
    const tooltip = container.children.item(1) as HTMLDivElement
    let tooltipWidth = 0
    if (tooltip) {
        tooltipWidth = tooltip.offsetWidth
        if (!tooltipWidth) {
            const styleWidth = tooltip.style.width
            tooltipWidth = Number.parseFloat(styleWidth.endsWith('px') ? styleWidth.substring(0, styleWidth.length) : styleWidth)
        }
        tooltipWidth = tooltipWidth || 0
    }
    if (maxWidth - pN - tooltipWidth - 10 < 0) {
        point[0] = pN - tooltipWidth - 20
    }
    return [...point]
}

export type PipProps = QueryResult & {
    displaySiteName: boolean
}

const Y_M_D = "{y}/{m}/{d}"
function calculateSubTitleText(date: Date | Date[]) {
    if (date instanceof Array) {
        const [start, _] = date
        const startStr = formatTime(start, Y_M_D)
        let endStr = formatTime(new Date(), Y_M_D)
        if (startStr === endStr) {
            return startStr
        } else {
            if (startStr.substring(0, 4) === endStr.substring(0, 4)) {
                // the same year
                endStr = endStr.substring(5)
            }
            return `${startStr}-${endStr}`
        }
    } else {
        return formatTime(date, Y_M_D)
    }
}

export function pieOptions(props: PipProps, container: HTMLDivElement): EcOption {
    const { type, mergeHost, data, displaySiteName, chartTitle, date } = props
    const titleText = chartTitle
    const subTitleText = `${calculateSubTitleText(date)} @ ${app}`
    const options: EcOption = {
        title: {
            text: titleText,
            subtext: subTitleText,
            left: 'center'
        },
        tooltip: {
            ...staticOptions.tooltip,
            formatter: params => toolTipFormatter(props, params),
            position: (point: (number | string)[]) => calcPositionOfTooltip(container, point)
        },
        legend: staticOptions.legend,
        series: [{
            ...staticOptions.series[0],
            label: {
                formatter: ({ name }) => mergeHost || name === t(msg => msg.otherLabel) ? name : `{${legend2LabelStyle(name)}|} {a|${name}}`
            }
        }],
        toolbox: staticOptions.toolbox
    }
    const series = []
    const iconRich = {}
    data.forEach(d => {
        const { host, alias, isOther } = d
        const legend = displaySiteName ? (alias || host) : host
        series.push({ name: legend, value: d[type] || 0, host, isOther })
        iconRich[legend2LabelStyle(legend)] = {
            height: LABEL_ICON_SIZE,
            width: LABEL_ICON_SIZE,
            fontSize: LABEL_ICON_SIZE,
            backgroundColor: { image: d.iconUrl }
        }
    })
    options.series[0].data = series
    options.series[0].label.rich = {
        a: { fontSize: LABEL_FONT_SIZE },
        ...iconRich
    }
    return options
}
