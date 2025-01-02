import { EchartsWrapper } from "@hooks/useEcharts"
import { type PopupResult } from "@popup/common"
import { t } from "@popup/locale"
import { IS_SAFARI } from "@util/constant/environment"
import { generateSiteLabel } from "@util/site"
import { getInfoColor, getPrimaryTextColor } from "@util/style"
import { formatPeriodCommon, formatTime } from "@util/time"
import { PieChart, type PieSeriesOption, TreemapChart, type TreemapSeriesOption } from "echarts/charts"
import {
    LegendComponent,
    type LegendComponentOption,
    TitleComponent,
    type TitleComponentOption,
    ToolboxComponent,
    type ToolboxComponentOption,
    TooltipComponent,
    type TooltipComponentOption,
} from "echarts/components"
import { type ComposeOption, use } from "echarts/core"
import { SVGRenderer } from "echarts/renderers"
import { generateTextOption } from "../common"

type EcOption = ComposeOption<
    | PieSeriesOption
    | TreemapSeriesOption
    | TitleComponentOption
    | ToolboxComponentOption
    | TooltipComponentOption
    | LegendComponentOption
>

use([SVGRenderer, PieChart, TreemapChart, LegendComponent, TitleComponent, TooltipComponent, ToolboxComponent])

// The declarations of labels
type PieLabelRichOption = PieSeriesOption['label']['rich']
type PieLabelRichValueOption = PieLabelRichOption[string]
// The declaration of data item
type PieSeriesItemOption = PieSeriesOption['data'][0]
    & Pick<timer.stat.StatKey, 'siteKey' | 'cateKey'>
    & {
        iconUrl?: string,
        isOther?: boolean
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
    if (!legend) return ''
    const code = []
    for (let i = 0; i < legend.length; i++) {
        code.push(legend.charCodeAt(i).toString(36).padStart(3, '0'))
    }
    return code.join('')
}

function calculateAverageText(type: timer.core.Dimension, averageValue: number): string | undefined {
    if (type === 'focus') {
        return t(msg => msg.chart.averageTime, { value: formatPeriodCommon(parseInt(averageValue.toFixed(0))) })
    } else if (type === 'time') {
        return t(msg => msg.chart.averageCount, { value: averageValue.toFixed(1) })
    }
    return undefined
}

function toolTipFormatter({ query, dateLength }: PopupResult, params: any): string {
    const format = params instanceof Array ? params[0] : params
    const { name, value, percent } = format
    const data = format.data as ChartRow
    const host = data.siteKey?.host
    const siteLabel = generateSiteLabel(host, name)
    let result = siteLabel
    const itemValue = typeof value === 'number' ? value as number : 0
    const { type } = query
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

function labelFormatter(result: PopupResult, params: any): string {
    const format = params instanceof Array ? params[0] : params
    const { name } = format
    const data = format.data as PieSeriesItemOption
    const { isOther, iconUrl } = data
    // Un-supported to get favicon url in Safari
    return result?.query?.mergeMethod || isOther || !iconUrl || IS_SAFARI
        ? name
        : `{${legend2LabelStyle(name)}|} {a|${name}}`
}

const maxWidth = 750

function calcPositionOfTooltip(container: HTMLElement, point: (number | string)[]) {
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

type ChartRow = timer.stat.Row & { isOther?: boolean }

function cvt2ChartRows(result: PopupResult): ChartRow[] {
    const { rows, query, itemCount } = result || {}
    const { type } = query || {}
    const popupRows: ChartRow[] = []
    const other = otherChartRow()
    let otherCount = 0
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        if (i < itemCount) {
            popupRows.push(row)
        } else {
            other.focus += row.focus
            otherCount++
        }
    }
    other.siteKey.host = t(msg => msg.chart.otherLabel, { count: otherCount })
    popupRows.push(other)
    const data = popupRows.filter(item => !!item[type])
    return data
}

const otherChartRow = (): ChartRow => ({
    siteKey: {
        host: t(msg => msg.chart.otherLabel, { count: 0 }),
        type: 'normal',
    },
    focus: 0,
    date: '0000-00-00',
    time: 0,
    isOther: true,
    iconUrl: undefined,
    alias: undefined,
})

export default class SiteWrapper extends EchartsWrapper<PopupResult, EcOption> {
    init(container: HTMLDivElement): void {
        super.init(container)
        // this.instance.on('click', console.log)
        this.instance.on('selectchanged', console.log)
    }

    protected generateOption(result: PopupResult): EcOption | Promise<EcOption> {
        if (!result) return {}

        const { query, displaySiteName } = result
        const { type } = query || {}
        const textColor = getPrimaryTextColor()
        const inactiveColor = getInfoColor()

        const iconRich: PieLabelRichOption = {}
        const chartRows = cvt2ChartRows(result)
        const series = chartRows.map(d => {
            const { siteKey, cateKey, alias, isOther, iconUrl } = d
            const host = siteKey?.host
            const legend = displaySiteName ? (alias || host) : host
            const richValue: PieLabelRichValueOption = { ...BASE_LABEL_RICH_VALUE }
            iconUrl && (richValue.backgroundColor = { image: iconUrl })
            iconRich[legend2LabelStyle(legend)] = richValue

            return { name: legend, value: d[type] || 0, siteKey, cateKey, isOther, iconUrl } satisfies PieSeriesItemOption
        })

        const options: EcOption = {
            title: generateTextOption(result),
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => toolTipFormatter(result, params),
                position: (point: (number | string)[]) => calcPositionOfTooltip(this.getDom(), point)
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                left: 15,
                top: 20,
                bottom: 50,
                textStyle: { color: textColor },
                pageTextStyle: { color: textColor },
                inactiveColor,
            },
            series: [{
                name: "NO_DATA",
                type: "pie",
                radius: "55%",
                selectedMode: false,
                center: ["60%", "52%"],
                startAngle: 300,
                data: series,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                },
                label: {
                    formatter: params => labelFormatter(result, params),
                    color: textColor,
                    rich: {
                        a: { fontSize: LABEL_FONT_SIZE },
                        ...iconRich,
                    },
                },
                avoidLabelOverlap: true,
                minShowLabelAngle: 3,
            }],
            toolbox: {
                show: true,
                top: 5,
                right: 5,
                feature: {
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
                }
            }
        }
        return options
    }
}