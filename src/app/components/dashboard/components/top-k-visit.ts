/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ECharts } from "echarts/core"
import { init, use, ComposeOption } from "echarts/core"
import { PieChart, PieSeriesOption } from "echarts/charts"
import {
    TitleComponent, TitleComponentOption,
    TooltipComponent, TooltipComponentOption,
} from "echarts/components"

use([PieChart, TitleComponent, TooltipComponent])

import timerService, { SortDirect, TimerQueryParam } from "@service/timer-service"
import { MILL_PER_DAY } from "@util/time"
import { ElLoading } from "element-plus"
import { defineComponent, h, onMounted, ref, Ref } from "vue"
import DataItem from "@entity/dto/data-item"
import { BASE_TITLE_OPTION } from "../common"
import { t } from "@app/locale"

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
}

function optionOf(data: _Value[]): EcOption {
    return {
        title: {
            ...BASE_TITLE_OPTION,
            text: t(msg => msg.dashboard.topK.title, { k: TOP_NUM, day: DAY_NUM })
        },
        tooltip: {
            show: true,
            formatter(params: any) {
                const visit = params.data?.value || 0
                const host = params.data?.name || ''
                return t(msg => msg.dashboard.topK.tooltip, { visit, host })
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
            const top: DataItem[] = (await timerService.selectByPage(query, { pageNum: 1, pageSize: TOP_NUM })).list
            const data: _Value[] = top.map(({ time, host }) => ({ name: host, value: time }))
            for (let realSize = top.length; realSize < TOP_NUM; realSize++) {
                data.push({ name: '', value: 0 })
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