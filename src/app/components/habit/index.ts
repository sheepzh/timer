/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import { defineComponent, h, ref, onMounted } from "vue"
import periodService from "@service/period-service"
import { daysAgo, isSameDay } from "@util/time"
import ContentContainer from "@app/components/common/content-container"
import HabitChart, { HabitChartInstance } from "./component/chart"
import HabitFilter from "./component/filter"
import { keyOf, MAX_PERIOD_ORDER, keyBefore } from "@util/period"

function computeParam(periodSize: Ref<number>, dateRange: Ref<[Date, Date]>, averageByDate: Ref<boolean>) {
    let dateRangeVal = dateRange.value
    if (dateRangeVal.length !== 2) dateRangeVal = daysAgo(1, 0)
    const endDate = typeof dateRangeVal[1] === 'object' ? dateRangeVal[1] : null
    const startDate = typeof dateRangeVal[1] === 'object' ? dateRangeVal[1] : null
    const now = new Date()
    const endIsToday = isSameDay(now, endDate)

    let periodEnd: timer.period.Key, periodStart: timer.period.Key
    if (endIsToday) {
        periodEnd = keyOf(now)
        periodStart = keyOf(startDate, periodEnd.order)
        periodEnd = keyBefore(periodEnd, 1)
    } else {
        periodEnd = keyOf(endDate, MAX_PERIOD_ORDER)
        periodStart = keyOf(startDate, 0)
    }

    const remainder = (periodEnd.order + 1) % periodSize.value
    if (remainder) {
        periodEnd = keyBefore(periodEnd, remainder)
        periodStart = keyBefore(periodStart, remainder)
    }

    return {
        dateRange: dateRange.value,
        // Must query one by one, if average
        periodSize: averageByDate.value ? 1 : periodSize.value,
        periodStart,
        periodEnd
    }
}

const _default = defineComponent({
    setup() {
        const chart: Ref<HabitChartInstance> = ref()
        const periodSize: Ref<number> = ref(1)
        const dateRange: Ref<[Date, Date]> = ref(daysAgo(1, 0))
        const averageByDate: Ref<boolean> = ref(false)

        async function queryAndRender() {
            const queryParam = computeParam(periodSize, dateRange, averageByDate)
            const result = await periodService.list(queryParam)
            chart.value.render?.(result, averageByDate.value, periodSize.value)
        }

        onMounted(queryAndRender)

        return () => h(ContentContainer, {}, {
            filter: () => h(HabitFilter, {
                periodSize: periodSize.value,
                dateRange: dateRange.value,
                averageByDate: averageByDate.value,
                onChange(newVal: HabitFilterOption) {
                    periodSize.value = newVal.periodSize
                    dateRange.value = newVal.dateRange
                    averageByDate.value = newVal.averageByDate
                    queryAndRender()
                }
            }),
            content: () => h(HabitChart, { ref: chart })
        })
    }
})

export default _default
