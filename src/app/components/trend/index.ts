/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"
import type { FilterProps } from "./components/filter"

import { defineComponent, h, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { daysAgo } from "@util/time"
import ContentContainer from "../common/content-container"
import TrendChart from "./components/chart"
import filterContainer, { addToFilterOption } from "./components/filter"
import HostOptionInfo from "./host-option-info"

type QueryParam = {
    host: string
    merge: '1' | '0' | undefined
}

function initWithQuery(domainKey: Ref<string>, dateRange: Ref<Date[]>, chart: Ref) {
    // Process the query param
    const query: QueryParam = useRoute().query as unknown as QueryParam
    useRouter().replace({ query: {} })
    onMounted(() => {
        const { host, merge } = query
        // Init with queries
        if (host) {
            const option = new HostOptionInfo(host, merge === '1' || false)
            addToFilterOption(option)
            domainKey.value = option.key()
        } else {
            domainKey.value = ''
        }

        // Init here
        chart.value.setDateRange(dateRange.value)
    })
}

const _default = defineComponent({
    name: "Trend",
    setup() {
        const domainKey: Ref<string> = ref('')
        // @ts-ignore
        const dateRange: Ref<Date[]> = ref(daysAgo(7, 0))
        const chart: Ref = ref()

        watch(domainKey, () => chart.value.setDomain(domainKey.value))
        watch(dateRange, () => chart.value.setDateRange(dateRange.value))

        const filterProps: FilterProps = {
            dateRangeRef: dateRange,
            domainKeyRef: domainKey,
        }

        initWithQuery(domainKey, dateRange, chart)

        return () => h(ContentContainer, {}, {
            filter: () => filterContainer(filterProps),
            content: () => h(TrendChart, { ref: chart })
        })
    }
})

export default _default
