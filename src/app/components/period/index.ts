import { ECharts, init } from "echarts"
import { computed, ComputedRef, defineComponent, h, onMounted, ref, Ref, watch } from "vue"
import { MAX_PERIOD_ORDER, PeriodKey } from "../../../entity/dto/period-info"
import periodService, { PeriodQueryParam } from "../../../service/period-service"
import { daysAgo, isSameDay } from "../../../util/time"
import chart, { ChartProps } from "./chart"
import generateOptions from "./chart/option"
import filter from './filter'

const periodSizeRef: Ref<string> = ref('1')
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

    let periodEnd = endIsToday ? PeriodKey.of(now) : PeriodKey.of(endDate, MAX_PERIOD_ORDER)
    let periodStart = endIsToday ? PeriodKey.of(startDate, periodEnd.order).after(1) : PeriodKey.of(startDate, 0)

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


const _default = defineComponent(() => {
    onMounted(() => {
        bar = init(chartRef.value)
        queryAndRenderChart()
    })

    return () => h('div', { class: 'content-container' }, [filter(filterProps), chart(chartProps)])
})

export default _default