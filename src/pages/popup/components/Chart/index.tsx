import { useManualRequest } from "@hooks/useRequest"
import { t } from "@popup/locale"
import { doQuery } from "@popup/query"
import { sum } from "@util/array"
import { formatPeriodCommon } from "@util/time"
import { computed, defineComponent } from "vue"
import Pie from "./Pie"

const Chart = defineComponent(() => {
    const { data: result, param, refreshAgain } = useManualRequest(doQuery)

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
        <Pie value={result.value} onRestore={refreshAgain} />
    </>
})

export default Chart