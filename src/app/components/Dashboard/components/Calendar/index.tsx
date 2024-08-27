/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useRequest } from "@hooks"
import { useEcharts } from "@hooks/useEcharts"
import { locale } from "@i18n"
import statService from "@service/stat-service"
import { getWeeksAgo, MILL_PER_HOUR } from "@util/time"
import { defineComponent } from "vue"
import Wrapper, { BizOption } from "./Wrapper"
import { groupBy, sum } from "@util/array"
import { t } from "@app/locale"
import ChartTitle from "../../ChartTitle"

const WEEK_NUM = 53

const titleText = (option: BizOption) => {
    const { value } = option || {}
    const totalMills = sum(Object.values(value || {}))
    const totalHours = Math.floor(totalMills / MILL_PER_HOUR)
    return t(msg => totalHours
        ? msg.dashboard.heatMap.title0
        : msg.dashboard.heatMap.title1,
        { hour: totalHours }
    )
}

const fetchData = async (): Promise<BizOption> => {
    const endTime = new Date()
    const startTime: Date = getWeeksAgo(endTime, locale === "zh_CN", WEEK_NUM)
    const items = await statService.select({ date: [startTime, endTime], sort: "date" })
    const value = groupBy(
        items,
        i => i.date,
        list => sum(list?.map(i => i.focus ?? 0))
    )
    return { value, startTime, endTime }
}

const _default = defineComponent(() => {
    const { data } = useRequest<void, BizOption>(fetchData)
    const { elRef } = useEcharts(Wrapper, data)

    return () => (
        <div class="calendar-container">
            <ChartTitle text={titleText(data.value)} />
            <div ref={elRef} style={{ flex: 1 }} />
        </div>
    )
})

export default _default