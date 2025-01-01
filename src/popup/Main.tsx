import { useRequest } from "@hooks/useRequest"
import { sum } from "@util/array"
import { formatPeriodCommon } from "@util/time"
import { computed, defineComponent } from "vue"
import Footer from "./components/Bar"
import Chart from "./components/Pie"
import { t } from "./locale"
import { doQuery } from "./query"

const Main = defineComponent(() => {
    const { data: result, refresh, param, refreshAgain } = useRequest(doQuery, { manual: true })

    const total = computed(() => {
        const { type } = param.value?.[0] || {}
        const data = result.value?.data || []
        if (type === 'time') {
            const totalCount = sum(data.map(d => d.time || 0))
            return t(msg => msg.chart.totalCount, { totalCount })
        } else if (type === 'focus') {
            const totalTime = formatPeriodCommon(sum(data.map(d => d.focus || 0)))
            return t(msg => msg.chart.totalTime, { totalTime })
        } else {
            return ''
        }
    })

    return () => <>
        <Chart value={result.value} onRestore={refreshAgain} />
        <Footer total={total.value} onQueryChange={refresh} />
    </>
})

export default Main


