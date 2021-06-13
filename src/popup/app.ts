import { version } from '../../package.json'
import { ECharts, init, use } from "echarts/core"
import { EChartOption } from "echarts/lib/echarts"
import { PieChart } from 'echarts/charts'
import { TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// Register echarts
use([TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent, CanvasRenderer, PieChart])

import { ElLink, ElOption, ElSelect, ElSwitch, ElTooltip } from "element-plus"
import { computed, ComputedRef, defineComponent, h, onMounted, Ref, ref, watch } from "vue"
import { locale, t } from "../common/vue-i18n"
import SiteInfo, { ALL_SITE_ITEMS, SiteItem } from "../entity/dto/site-info"
import timerService, { SortDirect, TimerQueryParam } from "../service/timer-service"
import { IS_FIREFOX } from "../util/constant/environment"
import { UPDATE_PAGE, ZH_FEEDBACK_PAGE } from "../util/constant/url"
import { formatPeriodCommon, formatTime } from "../util/time"
import { Locale } from "../locale/constant"
import { getLatestVersion } from "../api/version"


const DEFAULT_DATE_TYPE: SiteItem = 'focus'
/**
 * If the percentage of target site is less than SHOW_ICON_THRESHOLD, don't show its icon
 */
const LABEL_FONT_SIZE = 13
const LABEL_ICON_SIZE = 13

const typeRef: Ref<SiteItem> = ref(DEFAULT_DATE_TYPE)
const mergeDomainRef: Ref<boolean> = ref(false)

const chartContainerRef: Ref<HTMLDivElement> = ref()
let pie: ECharts

const app = t('app.name')
const today = formatTime(new Date(), '{y}_{m}_{d}')
const todayForShow = formatTime(new Date(), '{y}/{m}/{d}')
const host2LabelStyle = (host: string) => host.split('.').join('00').split('-').join('01').split(':').join('02')

// Data
const dataRef: Ref<SiteInfo[]> = ref([])

// Latest version
const latestVersionRef: Ref<string | null> = ref(null)
getLatestVersion().then(latestVersion => latestVersionRef.value = latestVersion)

// Query data and update the pie
const queryDataAndUpdate = () => {
    const param: TimerQueryParam = {
        date: new Date(),
        mergeDomain: mergeDomainRef.value,
        sort: typeRef.value,
        sortOrder: SortDirect.DESC
    }
    timerService
        .select(param, true)
        .then(rows => {
            const result = []
            const other: SiteInfo = { host: t('popup.otherLabel'), focus: 0, total: 0, date: '0000-00-00', time: 0, mergedHosts: [] }
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i]
                if (i < 10) {
                    result.push(row)
                } else {
                    other.focus += row.focus
                    other.total += row.total
                }
            }
            if (rows.length > 10) {
                result.push(other)
            }
            dataRef.value = result
            pie.setOption(pieOptions(), true, false)
        })
}

// Echart options of pie
const pieOptions: () => any = () => {
    const options: EChartOption<EChartOption.SeriesPie> = {
        title: {
            text: t('popup.title'),
            subtext: `${todayForShow} @ ${app}`,
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter(params: echarts.EChartOption.Tooltip.Format | echarts.EChartOption.Tooltip.Format[]) {
                const format: echarts.EChartOption.Tooltip.Format = params instanceof Array ? params[0] : params
                const { name, value, percent } = format
                return `${name}<br/>${typeRef.value === 'time' ? value || 0 : formatPeriodCommon(typeof value === 'number' ? value as number : 0)} (${percent}%)`
            }
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            left: 15,
            top: 20,
            bottom: 20,
            data: []
        },
        series: [
            {
                label: {
                    formatter: ({ name }) => mergeDomainRef.value || name === t('popup.otherLabel') ? name : `{${host2LabelStyle(name)}|} {a|${name}}`
                },
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
            }
        ],
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {
                    show: true,
                    title: t('popup.saveAsImageTitle'),
                    name: t('popup.fileName', { app, today }), // file name
                    excludeComponents: ['toolbox'],
                    pixelRatio: 2
                }
            }
        }
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
    return options
}

export default defineComponent(() => {
    const width = '750px'
    const height = '500px'

    // watch
    watch(typeRef, queryDataAndUpdate)
    watch(mergeDomainRef, queryDataAndUpdate)

    // pie container
    const pieChartContainer = () => h('div', { ref: chartContainerRef, style: `width:${width}; height:${height};` })
    queryDataAndUpdate()
    onMounted(() => {
        pie = init(chartContainerRef.value)
        // Bound the listener
        pie.on('click', (_params: any) => {
            const params = _params as { name: any; componentType: string; seriesType: string }
            const name = params.name
            const componentType = params.componentType
            if (componentType === 'series') {
                // Not the other item
                name !== t('popup.otherLabel')
                    // Then open it
                    && chrome.tabs.create({ url: `http://${name}` })
            }
        })
    })

    // footer
    // 1. total info and version
    const totalInfo: ComputedRef = computed(() => {
        const type = typeRef.value
        if (type === 'time') {
            const totalCount = dataRef.value.map(d => d[type] || 0).reduce((a, b) => a + b, 0)
            return t('popup.totalCount', { totalCount })
        } else {
            const totalTime = formatPeriodCommon(dataRef.value.map(d => d[type]).reduce((a, b) => a + b, 0))
            return t('popup.totalTime', { totalTime })
        }
    })
    const versionAndTotalInfo = () => h('span',
        {
            class: "option-left",
            style: "color: #606266;font-size:12px;"
        },
        `v${version} ${totalInfo.value}`
    )

    // 2. type select
    const options = () => ALL_SITE_ITEMS.map(item => h(ElOption, { value: item, label: t(`item.${item}`) }))
    const typeSelect = () => h(ElSelect,
        {
            modelValue: typeRef.value,
            class: 'option-right',
            style: 'width:140px;',
            size: 'mini',
            onChange: (val: SiteItem) => typeRef.value = val
        },
        options
    )

    // 3. merge domain switch
    const mergeDomainSwitch = () => h(ElTooltip,
        { content: t('popup.mergeDomainLabel') },
        () => h(ElSwitch,
            {
                modelValue: mergeDomainRef.value,
                style: 'margin-left:10px;',
                class: 'option-right',
                onChange: (val: boolean) => mergeDomainRef.value = val
            }
        )
    )

    // 4. app link
    const link = () => h(ElLink,
        {
            icon: 'el-icon-view',
            class: 'option-right',
            // FireFox use 'static' as prefix
            onClick: () => chrome.tabs.create({ url: IS_FIREFOX ? 'app.html' : 'static/app.html' })
        },
        () => t('popup.viewMore')
    )
    const feedback = () => h(ElLink,
        {
            icon: 'el-icon-edit',
            class: 'option-right',
            onClick: () => chrome.tabs.create({ url: ZH_FEEDBACK_PAGE })
        },
        () => t('popup.feedback'))

    const versionUpdate = () => h(ElTooltip,
        { placement: 'top', effect: 'light' },
        {
            default: () => h(ElLink,
                {
                    type: 'success',
                    icon: 'el-icon-download',
                    class: 'option-right',
                    onClick: () => chrome.tabs.create({ url: UPDATE_PAGE })
                },
                () => t('app.updateVersion')
            ),
            content: () => t('app.updateVersionInfo', { version: `v${latestVersionRef.value}` })
        })
    const footerItems = () => {
        const result = [versionAndTotalInfo(), typeSelect(), mergeDomainSwitch(), link()]
        locale === Locale.ZH_CN && result.push(feedback())
        const latestVersion = latestVersionRef.value
        latestVersion && latestVersion !== version && result.push(versionUpdate())
        return result
    }

    const footer = () => h('div', { class: 'option-container' }, footerItems())

    return () => h('div',
        { style: `width:${width}; height:${height};` },
        [pieChartContainer(), footer()]
    )
})