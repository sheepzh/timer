/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { useEcharts } from "@hooks/useEcharts"
import { locale } from "@i18n"
import statService from "@service/stat-service"
import { getWeeksAgo } from "@util/time"
import { defineComponent } from "vue"
import Wrapper, { BizOption } from "./Wrapper"
import { groupBy, sum } from "@util/array"

const WEEK_NUM = 53

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
    const { elRef } = useEcharts(Wrapper, fetchData)

    return () => <div class="chart-container" ref={elRef} />
})

export default _default