/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { PopupQueryResult, PopupRow } from "@popup/common"
import type { PieSeriesOption } from "echarts/charts"
import type {
    LegendComponentOption,
    TitleComponentOption,
    ToolboxComponentOption,
    TooltipComponentOption,
} from "echarts/components"
import type { ComposeOption } from "echarts/core"

import { createTab } from "@api/chrome/tab"
import { OPTION_ROUTE } from "@app/router/constants"
import { t } from "@popup/locale"
import { IS_SAFARI } from "@util/constant/environment"
import { getAppPageUrl } from "@util/constant/url"
import { generateSiteLabel } from "@util/site"
import { getPrimaryTextColor, getSecondaryTextColor } from "@util/style"
import { formatPeriodCommon, formatTime, parseTime } from "@util/time"
import { optionIcon } from "./toolbox-icon"

type EcOption = ComposeOption<
    | PieSeriesOption
    | TitleComponentOption
    | ToolboxComponentOption
    | TooltipComponentOption
    | LegendComponentOption
>

// The declarations of labels
type PieLabelRichOption = PieSeriesOption['label']['rich']
type PieLabelRichValueOption = PieLabelRichOption[string]
// The declaration of data item
type PieSeriesItemOption = PieSeriesOption['data'][0] & {
    host: string,
    iconUrl?: string,
    isOther?: boolean
}

type ChartProps = PopupQueryResult & {
    displaySiteName: boolean
}

const today = formatTime(new Date(), '{y}_{m}_{d}')

const LABEL_FONT_SIZE = 13
const LABEL_ICON_SIZE = 13
const BASE_LABEL_RICH_VALUE: PieLabelRichValueOption = {
    height: LABEL_ICON_SIZE,
    width: LABEL_ICON_SIZE,
    fontSize: LABEL_FONT_SIZE,
}

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
    const data = format.data as PieSeriesItemOption
    const { isOther, iconUrl } = data
    // Un-supported to get favicon url in Safari
    return mergeHost || isOther || !iconUrl || IS_SAFARI
        ? name
        : `{${legend2LabelStyle(name)}|} {a|${name}}`
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

function calculateSubTitleText(date: Date | [Date, Date?], dataDate: [string, string]): string {
    const format = t(msg => msg.calendar.dateFormat)

    if (!date) {
        date = dataDate?.map(parseTime) as [Date, Date]
    } else if (!(date instanceof Array)) {
        // Single day
        return formatTime(date, format)
    }

    const [start, end] = date
    if (!start && !end) return ''
    if (!start) return formatTime(end, format)
    if (!end) return formatTime(start, format)

    return combineDate(start, end, format)
}

function combineDate(start: Date, end: Date, format: string): string {
    const startStr = formatTime(start, format)
    const endStr = formatTime(end, format)
    if (startStr === endStr) {
        return startStr
    }
    const normalStr = `${startStr}-${endStr}`

    const sy = start.getFullYear()
    const ey = end.getFullYear()
    if (sy !== ey) {
        // Different years
        return normalStr
    }

    // The same years
    const execRes = /({d}|{m})[^{}]*({d}|{m})/.exec(format)
    let monthDatePart = execRes?.[0]

    if (!monthDatePart) return normalStr

    const newPart = `${monthDatePart}-${monthDatePart.replace('{m}', '{em}').replace('{d}', '{ed}')}`
    const newFormat = format.replace(monthDatePart, newPart)
    const em = end.getMonth() + 1
    const ed = end.getDate()
    return formatTime(start, newFormat)
        .replace('{em}', em.toString().padStart(2, '0'))
        .replace('{ed}', ed.toString().padStart(2, '0'))
}

export function pieOptions(props: ChartProps, container: HTMLDivElement): EcOption {
    const { type, data, displaySiteName, chartTitle, date } = props
    const titleText = chartTitle
    const dateText = calculateSubTitleText(date, props.dataDate)
    const subTitleText = `${dateText} @ ${t(msg => msg.meta.name)}`
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
            trigger: 'item',
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
            },
            label: {
                formatter: params => labelFormatter(props, params),
                color: textColor
            },
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
                    title: t(msg => msg.base.option),
                    icon: optionIcon,
                    onclick: () => createTab(getAppPageUrl(false, OPTION_ROUTE, { i: 'popup' }))
                }
            }
        }
    }
    const series: PieSeriesItemOption[] = []
    const iconRich: PieLabelRichOption = {}
    data.forEach(d => {
        const { host, alias, isOther, iconUrl } = d
        const legend = displaySiteName ? (alias || host) : host
        series.push({ name: legend, value: d[type] || 0, host, isOther, iconUrl })
        const richValue: PieLabelRichValueOption = { ...BASE_LABEL_RICH_VALUE }
        iconUrl && (richValue.backgroundColor = { image: iconUrl })
        iconRich[legend2LabelStyle(legend)] = richValue
    })
    options.series[0].data = series
    options.series[0].label.rich = {
        a: { fontSize: LABEL_FONT_SIZE },
        ...iconRich
    }
    return options
}
