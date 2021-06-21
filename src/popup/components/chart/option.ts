import { EChartOption } from "echarts"
import { Ref } from "vue"
import SiteInfo, { SiteItem } from "../../../entity/dto/site-info"
import { formatPeriodCommon, formatTime } from "../../../util/time"
import { t } from "../../locale"

const today = formatTime(new Date(), '{y}_{m}_{d}')
const todayForShow = formatTime(new Date(), '{y}/{m}/{d}')

export type PieOptionProps = {
    typeRef: Ref<SiteItem>
    mergeDomainRef: Ref<boolean>
    dataRef: Ref<SiteInfo[]>
}

/**
 * If the percentage of target site is less than SHOW_ICON_THRESHOLD, don't show its icon
 */
const LABEL_FONT_SIZE = 13
const LABEL_ICON_SIZE = 13

const app = t(msg => msg.appName)

const host2LabelStyle = (host: string) => host.split('.').join('00').split('-').join('01').split(':').join('02')

const toolTipFormatter = ({ typeRef }: PieOptionProps, params: echarts.EChartOption.Tooltip.Format | echarts.EChartOption.Tooltip.Format[]) => {
    const format: echarts.EChartOption.Tooltip.Format = params instanceof Array ? params[0] : params
    const { name, value, percent } = format
    return `${name}<br/>${typeRef.value === 'time' ? value || 0 : formatPeriodCommon(typeof value === 'number' ? value as number : 0)} (${percent}%)`
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
            saveAsImage: {
                show: true,
                title: t(msg => msg.saveAsImageTitle),
                name: t(msg => msg.fileName, { app, today }), // file name
                excludeComponents: ['toolbox'],
                pixelRatio: 2
            }
        }
    }
}

export const pieOptions = (props: PieOptionProps) => {
    const { typeRef, mergeDomainRef, dataRef } = props
    const options: EChartOption<EChartOption.SeriesPie> = {
        title: staticOptions.title,
        tooltip: {
            ...staticOptions.tooltip,
            formatter: params => toolTipFormatter(props, params)
        },
        legend: staticOptions.legend,
        series: [{
            ...staticOptions.series[0],
            label: {
                formatter: ({ name }) => mergeDomainRef.value || name === t(msg => msg.otherLabel) ? name : `{${host2LabelStyle(name)}|} {a|${name}}`
            }
        }],
        toolbox: staticOptions.toolbox
    }
    const legendData = []
    const series = []
    const iconRich = {}
    dataRef.value.forEach(d => {
        const { host } = d
        legendData.push(host)
        series.push({ name: host, value: d[typeRef.value] || 0 })
        iconRich[host2LabelStyle(host)] = {
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

