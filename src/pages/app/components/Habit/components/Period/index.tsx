/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { KanbanCard } from "@app/components/common/kanban"
import { t } from "@app/locale"
import { useRequest } from "@hooks/useRequest"
import { merge } from "@service/components/period-calculator"
import periodService from "@service/period-service"
import { keyOf, MAX_PERIOD_ORDER } from "@util/period"
import { getDayLength, MILL_PER_DAY } from "@util/time"
import { computed, defineComponent, type PropType, ref } from "vue"
import { useHabitFilter } from "../context"
import Average from "./Average"
import { type FilterOption } from "./common"
import { initProvider, type PeriodRange } from "./context"
import Filter from "./Filter"
import Stack from "./Stack"
import "./style.sass"
import Summary from "./Summary"
import Trend from "./Trend"

const computeRange = (filterDateRange: [Date, Date]): PeriodRange => {
    const [startDate, endDate] = filterDateRange || []
    const dateLength = getDayLength(startDate, endDate)
    const prevStartDate = new Date(startDate.getTime() - MILL_PER_DAY * dateLength)
    const prevEndDate = new Date(startDate.getTime() - MILL_PER_DAY)
    return {
        curr: [keyOf(startDate, 0), keyOf(endDate, MAX_PERIOD_ORDER)],
        prev: [keyOf(prevStartDate, 0), keyOf(prevEndDate, MAX_PERIOD_ORDER)],
    }
}

const fetchRows = async (range: timer.period.KeyRange, periodSize: number) => {
    const results = await periodService.listBetween({ periodRange: range })
    const [start, end] = range || []
    return merge(results, { start, end, periodSize })
}

const _default = defineComponent({
    props: {
        result: Array as PropType<timer.period.Result[]>,
        range: Object as PropType<timer.period.KeyRange>,
    },
    setup: () => {
        const globalFilter = useHabitFilter()
        const periodRange = computed(() => computeRange(globalFilter.value?.dateRange))
        const filter = ref<FilterOption>({ periodSize: 1, chartType: 'average' })

        const { data } = useRequest(async () => {
            const { curr: currRange, prev: prevRange } = periodRange.value || {}
            const periodSize = filter.value?.periodSize
            const [curr, prev] = await Promise.all([
                fetchRows(currRange, periodSize),
                fetchRows(prevRange, periodSize),
            ])
            return { curr, prev }
        }, { deps: [periodRange, filter], defaultValue: { curr: [], prev: [] } })

        initProvider(data, filter, periodRange)

        return () => (
            <KanbanCard
                title={t(msg => msg.habit.period.title)}
                v-slots={{
                    filter: () => <Filter defaultValue={filter.value} onChange={val => filter.value = val} />
                }}
            >
                <div class="habit-period-content">
                    <Summary />
                    <div class="chart-container">
                        {filter.value?.chartType === 'average' && <Average />}
                        {filter.value?.chartType === 'trend' && <Trend />}
                        {filter.value?.chartType === 'stack' && <Stack />}
                    </div>
                </div>
            </KanbanCard>
        )
    }
})

export default _default