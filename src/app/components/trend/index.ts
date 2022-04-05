/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h, onMounted, Ref, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { daysAgo } from "@util/time"
import ContentContainer from "../common/content-container"
import DomainTrend from "./components/host-trend"
import filterContainer, { addToFilterOption, FilterProps } from "./components/filter"
import HostOptionInfo from "./host-option-info"

const domainKeyRef: Ref<string> = ref('')
// @ts-ignore
const dateRangeRef: Ref<Date[]> = ref(daysAgo(7, 0))
const chartRef: Ref = ref()

watch(domainKeyRef, () => chartRef.value.setDomain(domainKeyRef.value))
watch(dateRangeRef, () => chartRef.value.setDateRange(dateRangeRef.value))

const filterProps: FilterProps = {
    dateRangeRef,
    domainKeyRef,
}

type QueryParam = {
    host: string
    merge: '1' | '0' | undefined
}

export default defineComponent(() => {
    // Process the query param
    const query: QueryParam = useRoute().query as unknown as QueryParam
    useRouter().replace({ query: {} })
    onMounted(() => {
        const { host, merge } = query
        // Init with queries
        if (host) {
            const option = new HostOptionInfo(host, merge === '1' || false)
            addToFilterOption(option)
            domainKeyRef.value = option.key()
        } else {
            domainKeyRef.value = ''
        }
    })

    // chart 
    const chart = () => h(DomainTrend, { ref: chartRef })
    return () => h(ContentContainer, {}, {
        filter: () => filterContainer(filterProps),
        content: () => chart()
    })
})

