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

import { formatPeriodCommon, formatTime } from "@util/time"
import { t } from "@popup/locale"
import { getPrimaryTextColor, getSecondaryTextColor } from "@util/style"
import { generateSiteLabel } from "@util/site"
import { IS_SAFARI } from "@util/constant/environment"
import { OPTION_ROUTE } from "@app/router/constants"
import { getAppPageUrl } from "@util/constant/url"
import { optionIcon } from "./toolbox-icon"
import { createTab } from "@api/chrome/tab"

type EcOption = ComposeOption<
    | PieSeriesOption
    | TitleComponentOption
    | ToolboxComponentOption
    | TooltipComponentOption
    | LegendComponentOption
>

type ChartProps = PopupQueryResult & {
    displaySiteName: boolean
}

const today = formatTime(new Date(), '{y}_{m}_{d}')

/**
 * If the percentage of target site is less than SHOW_ICON_THRESHOLD, don't show its icon
 */
const LABEL_FONT_SIZE = 13
const LABEL_ICON_SIZE = 13

const legend2LabelStyle = (legend: string) => {
    const code = []
    for (let i = 0; i < legend.length; i++) {
        code.push(legend.charCodeAt(i).toString(36).padStart(3, '0'))
    }
    return code.join('')
}

function calculateAverageText(type: timer.stat.Dimension, averageValue: number): string | undefined {
    if (type === 'focus') {
        return t(msg => msg.chart.averageTime, { value: formatPeriodCommon(parseInt(averageValue.toFixed(0))) })
    } else if (type === 'time') {
        return t(msg => msg.chart.averageCount, { value: averageValue.toFixed(1) })
    }
    return undefined
}

function toolTipFormatter({ type, dateLength }: PopupQueryResult, params: any): string {
    const format = params instanceof Array ? params[0] : params
    const { name, value, percent } = format
    const data = format.data as PopupRow
    const host = data.host
    const siteLabel = generateSiteLabel(host, name)
    let result = siteLabel
    const itemValue = typeof value === 'number' ? value as number : 0
    const valueText = type === 'time' ? itemValue : formatPeriodCommon(itemValue)
    result += '<br/>' + valueText
    // Display percent only when query focus time
    type === 'focus' && (result += ` (${percent}%)`)
    if (!data.isOther && dateLength && dateLength > 1) {
        const averageValueText = calculateAverageText(type, itemValue / dateLength)
        averageValueText && (result += `<br/>${averageValueText}`)
    }
    return result
}

function labelFormatter({ mergeHost }: PopupQueryResult, params: any): string {
    const format = params instanceof Array ? params[0] : params
    const { name } = format
    const data = format.data as PopupRow
    // Un-supported to get favicon url in Safari
    return mergeHost || data.isOther || IS_SAFARI
        ? name
        : `{${legend2LabelStyle(name)}|} {a|${name}}`
}

const staticOptions: EcOption = {
    tooltip: {
        trigger: 'item'
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
    }]
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

export function pieOptions(props: ChartProps, container: HTMLDivElement): EcOption {
    const { type, data, displaySiteName, chartTitle, date } = props
    const titleText = chartTitle
    const subTitleText = `${calculateSubTitleText(date)} @ ${t(msg => msg.meta.name)}`
    const textColor = getPrimaryTextColor()
    const secondaryColor = getSecondaryTextColor()
    const options: EcOption = {
        title: {
            text: titleText,
            subtext: subTitleText,
            left: 'center',
            textStyle: { color: textColor },
            subtextStyle: { color: secondaryColor },
        },
        tooltip: {
            ...staticOptions.tooltip,
            formatter: (params: any) => toolTipFormatter(props, params),
            position: (point: (number | string)[]) => calcPositionOfTooltip(container, point)
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            left: 15,
            top: 20,
            bottom: 20,
            textStyle: { color: textColor }
        },
        series: [{
            ...staticOptions.series[0],
            label: {
                formatter: params => labelFormatter(props, params),
                color: textColor
            }
        }],
        toolbox: {
            show: true,
            feature: {
                restore: {
                    show: true,
                    title: t(msg => msg.chart.restoreTitle)
                },
                saveAsImage: {
                    show: true,
                    title: t(msg => msg.chart.saveAsImageTitle),
                    // file name
                    name: t(msg => msg.chart.fileName, {
                        app: t(msg => msg.meta.name),
                        today
                    }),
                    excludeComponents: ['toolbox'],
                    pixelRatio: 1
                },
                // Customized tool's name must start with 'my'
                myOptions: {
                    show: true,
                    title: t(msg => msg.chart.options),
                    icon: optionIcon,
                    onclick: () => createTab(getAppPageUrl(false, OPTION_ROUTE, { i: 'popup' }))
                }
            }
        }
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
