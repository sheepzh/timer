/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { StatQueryParam } from "@service/stat-service"
import { MILL_PER_DAY } from "@util/time"
import { defineComponent } from "vue"
import statService from "@service/stat-service"
import { useEcharts } from "@hooks"
import Wrapper from "./Wrapper"

const PERIOD_WIDTH = 7

const fetchData = async (): Promise<timer.stat.Row[][]> => {
    const now = new Date()
    const lastPeriodStart = new Date(now.getTime() - MILL_PER_DAY * PERIOD_WIDTH * 2)
    const lastPeriodEnd = new Date(lastPeriodStart.getTime() + MILL_PER_DAY * (PERIOD_WIDTH - 1))
    const thisPeriodStart = new Date(now.getTime() - MILL_PER_DAY * PERIOD_WIDTH)
    // Not includes today
    const thisPeriodEnd = new Date(now.getTime() - MILL_PER_DAY)
    const query: StatQueryParam = {
        date: [lastPeriodStart, lastPeriodEnd],
        mergeDate: true,
    }
    // Query with alias
    // @since 1.1.8
    const lastPeriodItems: timer.stat.Row[] = await statService.select(query, true)
    query.date = [thisPeriodStart, thisPeriodEnd]
    const thisPeriodItems: timer.stat.Row[] = await statService.select(query, true)
    return [lastPeriodItems, thisPeriodItems]
}

const _default = defineComponent(() => {
    const { elRef } = useEcharts(Wrapper, fetchData)
    return () => <div class="chart-container" ref={elRef} />
})

export default _default