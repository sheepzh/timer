/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ECharts, ComposeOption } from "echarts/core"
import type { PieSeriesOption } from "echarts/charts"
import type { TitleComponentOption, TooltipComponentOption } from "echarts/components"
import type { Ref } from "vue"
import type { TimerQueryParam } from "@service/timer-service"

import { init, use } from "@echarts/core"
import PieChart from "@echarts/chart/pie"
import TitleComponent from "@echarts/component/title"
import TooltipComponent from "@echarts/component/tooltip"

use([PieChart, TitleComponent, TooltipComponent])

import timerService, { SortDirect } from "@service/timer-service"
import { MILL_PER_DAY } from "@util/time"
import { ElLoading } from "element-plus"
import { defineComponent, h, onMounted, ref } from "vue"
import { BASE_TITLE_OPTION } from "../common"
import { t } from "@app/locale"
import { getPrimaryTextColor } from "@util/style"
import { generateSiteLabel } from "@util/site"

const CONTAINER_ID = '__timer_dashboard_top_k_visit'
const TOP_NUM = 6
const DAY_NUM = 30

type EcOption = ComposeOption<
    | PieSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
>

type _Value = {
    name: string
    value: number
    // Extensive info
    host: string
    alias?: string
}

function optionOf(data: _Value[]): EcOption {
    const textColor = getPrimaryTextColor()
    return {
        title: {
            ...BASE_TITLE_OPTION,
            text: t(msg => msg.dashboard.topK.title, { k: TOP_NUM, day: DAY_NUM }),
            textStyle: {
                color: textColor,
                fontSize: '14px',
            }
        },
        tooltip: {
            show: true,
            formatter(params: any) {
                const visit = params.data?.value || 0
                const host = params.data?.host || ''
                const alias = params.data?.alias || ''
                const hostLabel = generateSiteLabel(host, alias)
                return t(msg => msg.dashboard.topK.tooltip, { visit, host: hostLabel })
            }
        },
        series: {
            top: '20%',
            height: '80%',
            name: "Monthly Top 10",
            type: 'pie',
            radius: [20, 80],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
                borderRadius: 7
            },
            label: { color: textColor },
            data: data
        }
    }
}

class ChartWrapper {
    instance: ECharts

    init(container: HTMLDivElement) {
        this.instance = init(container)
    }
    render(data: _Value[], loading: { close: () => void }) {
        const option = optionOf(data)
        this.instance.setOption(option)
        loading.close()
    }
}

const _default = defineComponent({
    name: "TopKVisit",
    setup() {
        const now = new Date()
        const startTime: Date = new Date(now.getTime() - MILL_PER_DAY * DAY_NUM)

        const chart: Ref = ref()
        const chartWrapper: ChartWrapper = new ChartWrapper()

        onMounted(async () => {
            const loading = ElLoading.service({
                target: `#${CONTAINER_ID}`,
            })
            chartWrapper.init(chart.value)
            const query: TimerQueryParam = {
                date: [startTime, now],
                sort: "time",
                sortOrder: SortDirect.DESC,
                mergeDate: true,
            }
            const top: timer.stat.Row[] = (await timerService.selectByPage(query, { num: 1, size: TOP_NUM }, { alias: true })).list
            const data: _Value[] = top.map(({ time, host, alias }) => ({ name: alias || host, host, alias, value: time }))
            for (let realSize = top.length; realSize < TOP_NUM; realSize++) {
                data.push({ name: '', host: '', value: 0 })
            }
            chartWrapper.render(data, loading)
        })
        return () => h('div', {
            id: CONTAINER_ID,
            class: 'chart-container',
            ref: chart,
        })
    }
})

export default _default