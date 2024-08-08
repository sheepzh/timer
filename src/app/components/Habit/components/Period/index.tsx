/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { KanbanCard } from "@app/components/common/kanban"
import { t } from "@app/locale"
import { PropType, defineComponent, ref, computed } from "vue"
import Filter from "./Filter"
import Summary from "./Summary"
import Trend from "./Trend"
import Average from "./Average"
import Stack from "./Stack"
import "./style.sass"
import { merge } from "@service/components/period-calculator"
import periodService from "@service/period-service"
import { useHabitFilter } from "../context"
import { getDayLength, MILL_PER_DAY } from "@util/time"
import { MAX_PERIOD_ORDER, keyOf } from "@util/period"
import { initProvider, PeriodRange } from "./context"
import { useRequest } from "@src/hooks/useRequest"
import { FilterOption } from "./common"

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

        return () => <KanbanCard
            title={t(msg => msg.habit.period.title)}
            v-slots={{
                filter: () => <Filter defaultValue={filter.value} onChange={val => filter.value = val} />,
                default: () => <div class="habit-period-content">
                    <div class="col0">
                        <Summary />
                    </div>
                    <div class="col1">
                        {filter.value?.chartType === 'average' && <Average />}
                        {filter.value?.chartType === 'trend' && <Trend />}
                        {filter.value?.chartType === 'stack' && <Stack />}
                    </div>
                </div>
            }}
        />
    }
})

export default _default