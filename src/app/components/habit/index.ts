/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"
import type { HabitFilterOption } from "./component/filter"

import { defineComponent, h, ref, onMounted } from "vue"
import { MAX_PERIOD_ORDER, PeriodKey } from "@entity/dto/period-info"
import periodService from "@service/period-service"
import { daysAgo, isSameDay } from "@util/time"
import ContentContainer from "@app/components/common/content-container"
import HabitChart from "./component/chart"
import HabitFilter from "./component/filter"

function computeParam(periodSize: Ref<number>, dateRange: Ref<Date[]>, averageByDate: Ref<boolean>) {
    let dateRangeVal = dateRange.value
    if (dateRangeVal.length !== 2) dateRangeVal = daysAgo(1, 0)
    const endDate = dateRangeVal[1]
    const startDate = dateRangeVal[0]
    const now = new Date()
    const endIsToday = isSameDay(now, endDate)

    let periodEnd: PeriodKey, periodStart: PeriodKey
    if (endIsToday) {
        periodEnd = PeriodKey.of(now)
        periodStart = PeriodKey.of(startDate, periodEnd.order)
        periodEnd = periodEnd.before(1)
    } else {
        periodEnd = PeriodKey.of(endDate, MAX_PERIOD_ORDER)
        periodStart = PeriodKey.of(startDate, 0)
    }

    const remainder = (periodEnd.order + 1) % periodSize.value
    if (remainder) {
        periodEnd = periodEnd.before(remainder)
        periodStart = periodStart.before(remainder)
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
    name: "Habit",
    setup() {
        const chart: Ref = ref()
        const periodSize: Ref<number> = ref(1)
        //@ts-ignore ts(2322)
        const dateRange: Ref<Date[]> = ref(daysAgo(1, 0))
        const averageByDate: Ref<boolean> = ref(false)

        async function queryAndRender() {
            const queryParam = computeParam(periodSize, dateRange, averageByDate)
            const result = await periodService.list(queryParam)
            chart?.value.render?.(result, averageByDate.value, periodSize.value)
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