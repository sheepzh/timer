/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { useRequest } from "@hooks"
import { useEcharts } from "@hooks/useEcharts"
import weekHelper from "@service/components/week-helper"
import statService from "@service/stat-service"
import { groupBy, sum } from "@util/array"
import { formatTimeYMD, MILL_PER_DAY, MILL_PER_HOUR } from "@util/time"
import { computed, defineComponent } from "vue"
import ChartTitle from "../../ChartTitle"
import Wrapper, { BizOption } from "./Wrapper"

const titleText = (option: Result) => {
    const { value, yearAgo } = option || {}
    const start = formatTimeYMD(yearAgo)
    const statValues = Object.entries(value || {}).filter(([date]) => date.localeCompare(start) >= 0).map(([, v]) => v)
    const totalMills = sum(statValues)
    const totalHours = Math.floor(totalMills / MILL_PER_HOUR)
    return t(msg => totalHours
        ? msg.dashboard.heatMap.title0
        : msg.dashboard.heatMap.title1,
        { hour: totalHours }
    )
}

type Result = BizOption & { yearAgo: Date }

const fetchData = async (): Promise<Result> => {
    const endTime = new Date()
    const yearAgo = new Date(endTime.getTime() - MILL_PER_DAY * 365)
    const [startTime] = await weekHelper.getWeekDate(yearAgo)
    const items = await statService.select({ date: [startTime, endTime], sort: "date" })
    const value = groupBy(
        items,
        i => i.date,
        list => sum(list?.map(i => i.focus ?? 0))
    )
    return { value, startTime, endTime, yearAgo }
}

const _default = defineComponent(() => {
    const { data } = useRequest(fetchData)
    const biz = computed(() => (data.value as BizOption))
    const { elRef } = useEcharts(Wrapper, biz)

    return () => (
        <div class="calendar-container">
            <ChartTitle text={titleText(data.value)} />
            <div ref={elRef} style={{ flex: 1 }} />
        </div>
    )
})

export default _default