/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ECharts, init } from "echarts"
import { computed, ComputedRef, defineComponent, onMounted, ref, Ref, watch } from "vue"
import { MAX_PERIOD_ORDER, PeriodKey } from "@entity/dto/period-info"
import periodService, { PeriodQueryParam } from "@service/period-service"
import { daysAgo, isSameDay } from "@util/time"
import { renderContentContainer } from "../common/content-container"
import chart, { ChartProps } from "./chart"
import generateOptions from "./chart/option"
import filter from "./filter"

const periodSizeRef: Ref<string> = ref('1')
//@ts-ignore ts(2322)
const dateRangeRef: Ref<Date[]> = ref(daysAgo(1, 0))
const averageRef: Ref<boolean> = ref(false)
const periodSizeNumberRef: ComputedRef<number> = computed(() => Number.parseInt(periodSizeRef.value))
const chartRef: Ref<HTMLDivElement> = ref()
let bar: ECharts

const filterProps = { dateRangeRef, periodSizeRef, averageRef }
const chartProps: ChartProps = { chartRef }

const queryParamRef: ComputedRef<PeriodQueryParam> = computed(() => {
    let dateRange = dateRangeRef.value
    if (dateRange.length !== 2) dateRange = daysAgo(1, 0)
    const endDate = dateRange[1]
    const startDate = dateRange[0]
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

    const remainder = (periodEnd.order + 1) % periodSizeNumberRef.value
    if (remainder) {
        periodEnd = periodEnd.before(remainder)
        periodStart = periodStart.before(remainder)
    }

    return {
        dateRange: dateRangeRef.value,
        // Must query one by one, if average
        periodSize: averageRef.value ? 1 : periodSizeNumberRef.value,
        periodStart,
        periodEnd
    }
})

const queryAndRenderChart = () => periodService.list(queryParamRef.value)
    .then(val => {
        const newOptions = generateOptions({ data: val, average: averageRef.value, periodSize: periodSizeNumberRef.value })
        bar.setOption(newOptions, true, false)
    })

watch([dateRangeRef, averageRef, periodSizeRef], () => queryAndRenderChart())

const handleMounted = () => {
    bar = init(chartRef.value)
    queryAndRenderChart()
}

const _default = defineComponent(() => {
    // Must use closure, not function variable
    onMounted(() => handleMounted())
    return renderContentContainer(() => [filter(filterProps), chart(chartProps)])
})

export default _default