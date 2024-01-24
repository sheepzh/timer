/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { ComposeOption } from "echarts/core"
import type { PieSeriesOption } from "echarts/charts"
import type { TitleComponentOption, TooltipComponentOption } from "echarts/components"
import type { Ref } from "vue"
import type { StatQueryParam } from "@service/stat-service"

import { use } from "@echarts/core"
import PieChart from "@echarts/chart/pie"
import TitleComponent from "@echarts/component/title"
import TooltipComponent from "@echarts/component/tooltip"

use([PieChart, TitleComponent, TooltipComponent])

import statService from "@service/stat-service"
import { MILL_PER_DAY } from "@util/time"
import { ElLoading } from "element-plus"
import { defineComponent, onMounted, ref } from "vue"
import { BASE_TITLE_OPTION } from "../common"
import { t } from "@app/locale"
import { getPrimaryTextColor } from "@util/style"
import { generateSiteLabel } from "@util/site"
import { EchartsWrapper } from "@app/components/common/echarts-wrapper"

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

function generateOption(data: _Value[]): EcOption {
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

class ChartWrapper extends EchartsWrapper<_Value[], EcOption> {
    generateOption = generateOption
}

const _default = defineComponent(() => {
    const now = new Date()
    const startTime: Date = new Date(now.getTime() - MILL_PER_DAY * DAY_NUM)

    const chart: Ref<HTMLDivElement> = ref()
    const chartWrapper: ChartWrapper = new ChartWrapper()

    onMounted(async () => {
        const loading = ElLoading.service({
            target: `#${CONTAINER_ID}`,
        })
        chartWrapper.init(chart.value)
        const query: StatQueryParam = {
            date: [startTime, now],
            sort: "time",
            sortOrder: 'DESC',
            mergeDate: true,
        }
        const top: timer.stat.Row[] = (await statService.selectByPage(query, { num: 1, size: TOP_NUM }, true)).list
        const data: _Value[] = top.map(({ time, host, alias }) => ({ name: alias || host, host, alias, value: time }))
        for (let realSize = top.length; realSize < TOP_NUM; realSize++) {
            data.push({ name: '', host: '', value: 0 })
        }
        await chartWrapper.render(data)
        loading.close()
    })
    return () => <div id={CONTAINER_ID} class="chart-container" ref={chart} />
})

export default _default