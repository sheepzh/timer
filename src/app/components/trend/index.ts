/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h, onMounted, Ref, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { daysAgo } from "@util/time"
import { renderContentContainer } from "../common/content-container"
import DomainTrend from "./components/host-trend"
import filterContainer, { addToFilterOption, FilterProps } from "./components/filter"
import HostOptionInfo from "./host-option-info"

const domainKeyRef: Ref<string> = ref('')
const dateRangeRef: Ref<Date[]> = ref()
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
        // Must init here, I don't know why ... XD
        dateRangeRef.value = daysAgo(7, 0)
    })

    // chart 
    const chart = () => h(DomainTrend, { ref: chartRef })
    return renderContentContainer(() => [filterContainer(filterProps), chart()])
})

