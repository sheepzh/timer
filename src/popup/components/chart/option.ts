/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { EChartOption } from "echarts"
import { formatPeriodCommon, formatTime } from "../../../util/time"
import { t } from "../../locale"
import { QueryResult } from "../../popup"

const today = formatTime(new Date(), '{y}_{m}_{d}')
const todayForShow = formatTime(new Date(), '{y}/{m}/{d}')

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

const toolTipFormatter = ({ type }: QueryResult, params: echarts.EChartOption.Tooltip.Format | echarts.EChartOption.Tooltip.Format[]) => {
    const format: echarts.EChartOption.Tooltip.Format = params instanceof Array ? params[0] : params
    const { name, value, percent } = format
    return `${name}<br/>${type === 'time' ? value || 0 : formatPeriodCommon(typeof value === 'number' ? value as number : 0)} (${percent}%)`
}

const staticOptions: EChartOption<EChartOption.SeriesPie> = {
    title: {
        text: t(msg => msg.title),
        subtext: `${todayForShow} @ ${app}`,
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        type: 'scroll',
        orient: 'vertical',
        left: 15,
        top: 20,
        bottom: 20,
        data: []
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

function calcPositionOfTooltip(container: HTMLDivElement, point: (number | string)[]): (number | string)[] | echarts.EChartOption.Tooltip.Position.Obj {
    let p: number | string = point[0]
    const pN: number = typeof p === 'number' ? p : Number.parseFloat(p)
    const tooltip = container.children.item(1) as HTMLDivElement
    let tooltipWidth = 0
    if (tooltip) {
        tooltipWidth = tooltip.offsetWidth
        if (!tooltipWidth) {
            const styleWidth = tooltip.style.width
            tooltipWidth = Number.parseFloat(styleWidth.endsWith('px') ? styleWidth.substr(0, styleWidth.length) : styleWidth)
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

export const pieOptions = (props: PipProps, container: HTMLDivElement) => {
    const { type, mergeDomain, data, displaySiteName } = props
    const options: EChartOption<EChartOption.SeriesPie> = {
        title: staticOptions.title,
        tooltip: {
            ...staticOptions.tooltip,
            formatter: params => toolTipFormatter(props, params),
            position: (point: (number | string)[]) => calcPositionOfTooltip(container, point)
        },
        legend: staticOptions.legend,
        series: [{
            ...staticOptions.series[0],
            label: {
                formatter: ({ name }) => mergeDomain || name === t(msg => msg.otherLabel) ? name : `{${legend2LabelStyle(name)}|} {a|${name}}`
            }
        }],
        toolbox: staticOptions.toolbox
    }
    const legendData = []
    const series = []
    const iconRich = {}
    data.forEach(d => {
        const { host, alias } = d
        const legend = displaySiteName ? (alias || host) : host
        legendData.push(legend)
        series.push({ name: legend, value: d[type] || 0 })
        iconRich[legend2LabelStyle(legend)] = {
            height: LABEL_ICON_SIZE,
            width: LABEL_ICON_SIZE,
            fontSize: LABEL_ICON_SIZE,
            backgroundColor: { image: d.iconUrl }
        }
    })
    options.legend.data = legendData
    options.series[0].data = series
    options.series[0].label.rich = {
        a: { fontSize: LABEL_FONT_SIZE },
        ...iconRich
    }
    return options as any
}
