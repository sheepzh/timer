/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { StatQueryParam } from "@service/stat-service"

import { use } from "echarts/core"
import { PieChart } from "echarts/charts"
import { TitleComponent, TooltipComponent } from "echarts/components"
import { SVGRenderer } from "echarts/renderers"

use([PieChart, TitleComponent, TooltipComponent, SVGRenderer])

import statService from "@service/stat-service"
import { MILL_PER_DAY } from "@util/time"
import { defineComponent } from "vue"
import { useEcharts } from "@hooks"
import Wrapper, { BizOption, DAY_NUM, TOP_NUM } from "./Wrapper"

const fetchData = async () => {
    const now = new Date()
    const startTime: Date = new Date(now.getTime() - MILL_PER_DAY * DAY_NUM)
    const query: StatQueryParam = {
        date: [startTime, now],
        sort: "time",
        sortOrder: 'DESC',
        mergeDate: true,
    }
    const top: timer.stat.Row[] = (await statService.selectByPage(query, { num: 1, size: TOP_NUM }, true)).list
    const data: BizOption[] = top.map(({ time, host, alias }) => ({ name: alias || host, host, alias, value: time }))
    for (let realSize = top.length; realSize < TOP_NUM; realSize++) {
        data.push({ name: '', host: '', value: 0 })
    }
    return data
}

const _default = defineComponent(() => {
    const { elRef } = useEcharts(Wrapper, fetchData)
    return () => <div class="chart-container" ref={elRef} />
})

export default _default