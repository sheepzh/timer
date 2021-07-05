import { defineComponent, h, onMounted, Ref, ref, watch } from "vue"
import { daysAgo } from "../../../util/time"
import { renderContentContainer } from "../common/content-container"
import DomainTrender from './components/domain-trender'
import filterContainer, { FilterProps } from "./components/filter"

const trenderDomainRef: Ref<string> = ref('')
const dateRangeRef: Ref<Array<Date>> = ref(daysAgo(15, 1))
const chartRef: Ref = ref()

const filterProps: FilterProps = {
    dateRangeRef,
    trenderDomainRef
}

export default defineComponent(() => {
    watch(trenderDomainRef, () => chartRef.value.setDomain(trenderDomainRef.value))
    watch(dateRangeRef, () => chartRef.value.setDateRange(dateRangeRef.value))
    onMounted(() => chartRef.value.setDateRange(dateRangeRef.value))

    // chart 
    const chart = () => h(DomainTrender, { ref: chartRef })
    return renderContentContainer(() => [filterContainer(filterProps), chart()])
})

