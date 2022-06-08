/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import { defineComponent, h, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { daysAgo } from "@util/time"
import ContentContainer from "../common/content-container"
import TrendChart from "./components/chart"
import TrendFilter from "./components/filter"
import HostOptionInfo from "./host-option-info"
import timerService, { SortDirect, TimerQueryParam } from "@service/timer-service"
import DataItem from "@entity/dto/data-item"

type _Queries = {
    host: string
    merge: '1' | '0' | undefined
}

function initWithQuery(hostOption: Ref<HostOptionInfo>) {
    // Process the query param
    const query: _Queries = useRoute().query as unknown as _Queries
    useRouter().replace({ query: {} })
    const { host, merge } = query
    // Init with queries
    host && (hostOption.value = new HostOptionInfo(host, merge === "1"))
}

async function query(hostOption: Ref<HostOptionInfo>, dateRange: Ref<Date[]>): Promise<DataItem[]> {
    const hostVal = hostOption.value?.host
    if (!hostVal) {
        return []
    }
    const param: TimerQueryParam = {
        // If the host is empty, no result will be queried with this param.
        host: hostVal,
        mergeHost: hostOption.value?.merged || false,
        date: dateRange.value,
        fullHost: true,
        sort: 'date',
        sortOrder: SortDirect.ASC
    }
    return await timerService.select(param)
}

const _default = defineComponent({
    name: "Trend",
    setup() {
        // @ts-ignore
        const dateRange: Ref<Date[]> = ref(daysAgo(7, 0))
        const hostOption: Ref<HostOptionInfo> = ref()
        const chart: Ref = ref()
        const filter: Ref = ref()

        initWithQuery(hostOption)

        async function queryAndRender() {
            const row = await query(hostOption, dateRange)
            chart.value?.render(hostOption.value, dateRange.value, row)
        }

        onMounted(queryAndRender)

        return () => h(ContentContainer, {}, {
            filter: () => h(TrendFilter, {
                defaultValue: hostOption.value,
                dateRange: dateRange.value,
                ref: filter,
                onChange(newHostOption: HostOptionInfo, newDateRange: Date[]) {
                    hostOption.value = newHostOption
                    dateRange.value = newDateRange
                    queryAndRender()
                }
            }),
            content: () => h(TrendChart, { ref: chart })
        })
    }
})

export default _default
