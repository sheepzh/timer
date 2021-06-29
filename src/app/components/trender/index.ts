import { defineComponent, h, onMounted, Ref, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { daysAgo } from "../../../util/time"
import DomainTrender from './components/domain-trender'
import filterContainer, { addToFilterOption, FilterProps } from "./components/filter"
import DomainOptionInfo from "./domain-option-info"

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
            const option = new DomainOptionInfo(host, merge === '1' || false)
            addToFilterOption(option)
            domainKeyRef.value = option.key()
        } else {
            domainKeyRef.value = ''
        }
        // Must init here, I don't know why ... XD
        dateRangeRef.value = daysAgo(7, 0)
    })

    // chart 
    const chart = () => h(DomainTrender, { ref: chartRef })
    return () => h('div', { class: 'content-container' }, [filterContainer(filterProps), chart()])
})

