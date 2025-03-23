/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { t } from "@app/locale"
import { useEcharts } from "@hooks/useEcharts"
import statService, { type StatQueryParam } from "@service/stat-service"
import { MILL_PER_DAY } from "@util/time"
import { defineComponent } from "vue"
import ChartTitle from "../../ChartTitle"
import Wrapper, { type BizOption, DAY_NUM, TOP_NUM } from "./Wrapper"

const fetchData = async () => {
    const now = new Date()
    const startTime: Date = new Date(now.getTime() - MILL_PER_DAY * DAY_NUM)
    const query: StatQueryParam = {
        date: [startTime, now],
        sort: "time",
        sortOrder: 'DESC',
        mergeDate: true,
    }
    const top = (await statService.selectByPage(query, { num: 1, size: TOP_NUM })).list
    const data: BizOption[] = top.map(({ time, siteKey, alias }) => ({
        name: alias ?? siteKey?.host ?? '',
        host: siteKey?.host ?? '',
        alias,
        value: time,
    }))
    for (let realSize = top.length; realSize < TOP_NUM; realSize++) {
        data.push({ name: '', host: '', value: 0 })
    }
    return data
}

const _default = defineComponent(() => {
    const { elRef } = useEcharts(Wrapper, fetchData)
    const title = t(msg => msg.dashboard.topK.title, { k: TOP_NUM, day: DAY_NUM })
    return () => (
        <div class="top-visit-container">
            <ChartTitle text={title} />
            <div style={{ flex: 1 }} ref={elRef} />
        </div>
    )
})

export default _default