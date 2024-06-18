/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { useEcharts } from "@hooks"
import { locale } from "@i18n"
import statService from "@service/stat-service"
import { getWeeksAgo } from "@util/time"
import { defineComponent } from "vue"
import Wrapper, { BizOption } from "./Wrapper"

const WEEK_NUM = 53

const fetchData = async (): Promise<BizOption> => {
    const endTime = new Date()
    const startTime: Date = getWeeksAgo(endTime, locale === "zh_CN", WEEK_NUM)
    const items = await statService.select({ date: [startTime, endTime], sort: "date" })
    const value: { [date: string]: number } = {}
    items.forEach(({ date, focus }) => value[date] = (value[date] || 0) + focus)
    return { value, startTime, endTime }
}

const _default = defineComponent(() => {
    const { elRef } = useEcharts(Wrapper, fetchData)

    return () => <div class="chart-container" ref={elRef} />
})

export default _default