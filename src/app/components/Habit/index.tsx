/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"
import type { FilterOption } from "./type"

import { defineComponent, ref, onMounted, computed, watch } from "vue"
import periodService from "@service/period-service"
import statService from "@service/stat-service"
import { daysAgo, isSameDay } from "@util/time"
import ContentContainer from "@app/components/common/content-container"
import HabitFilter from "./components/HabitFilter"
import Site from "./components/site"
import Period from "./components/period"
import { keyOf, MAX_PERIOD_ORDER, keyBefore } from "@util/period"
import { initProvider } from "./components/context"

function computeParam(dateRange: [Date, Date]): timer.period.KeyRange {
    if (dateRange.length !== 2) dateRange = daysAgo(1, 0)
    const endDate = typeof dateRange[1] === 'object' ? dateRange[1] : null
    const startDate = typeof dateRange[0] === 'object' ? dateRange[0] : null
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
    return [periodStart, periodEnd]
}

const _default = defineComponent(() => {
    const filter: Ref<FilterOption> = ref({
        dateRange: daysAgo(7, 0),
        timeFormat: "default",
    })
    const periodRange = computed(() => computeParam(filter.value?.dateRange))
    const periodResults: Ref<timer.period.Result[]> = ref([])
    const rows: Ref<timer.stat.Row[]> = ref([])

    initProvider(filter)

    async function fetchData() {
        periodResults.value = await periodService.list({ periodRange: periodRange.value })
        rows.value = await statService.select({ exclusiveVirtual: true, date: filter.value?.dateRange }, true)
    }

    watch(filter, fetchData)
    onMounted(fetchData)

    return () => (
        <ContentContainer v-slots={{
            filter: () => <HabitFilter defaultValue={filter.value} onChange={val => val && (filter.value = { ...val })} />
        }}>
            <Site />
            <Period />
        </ContentContainer>
    )

})

export default _default
