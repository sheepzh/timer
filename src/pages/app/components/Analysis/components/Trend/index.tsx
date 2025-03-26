/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { type DimensionEntry, type ValueFormatter } from "@app/components/Analysis/util"
import { KanbanCard } from "@app/components/common/kanban"
import { t } from "@app/locale"
import { cvt2LocaleTime, periodFormatter } from "@app/util/time"
import { useState } from "@hooks"
import { groupBy } from "@util/array"
import { MILL_PER_DAY, daysAgo, getAllDatesBetween, getDayLength } from "@util/time"
import { computed, defineComponent, onMounted, ref, watch, type Ref } from "vue"
import { useAnalysisRows, useAnalysisTimeFormat } from "../../context"
import { initProvider } from "./context"
import Dimension, { DimensionData } from "./Dimension"
import Filter from "./Filter"
import './style.sass'
import Total from "./Total"

type DailyIndicator = {
    value: number | undefined
    date: string | undefined
}

type GlobalIndicator = number

type DimensionType = 'focus' | 'visit'

type IndicatorSet = Record<DimensionType, {
    max: DailyIndicator
    total: GlobalIndicator
    average: GlobalIndicator | undefined
}> & {
    activeDay: number
}

type SourceParam = {
    dateRange: [Date, Date]
    rows: timer.stat.Row[]
}

type EffectParam = {
    indicators: Ref<IndicatorSet | undefined>
    previousIndicators: Ref<IndicatorSet | undefined>
    focusData: Ref<DimensionData | undefined>
    visitData: Ref<DimensionData | undefined>
}

const VISIT_MAX = t(msg => msg.analysis.trend.maxVisit)
const VISIT_AVE = t(msg => msg.analysis.trend.averageVisit)
const VISIT_CHART_TITLE = t(msg => msg.analysis.trend.visitTitle)
const FOCUS_MAX = t(msg => msg.analysis.trend.maxFocus)
const FOCUS_AVE = t(msg => msg.analysis.trend.averageFocus)
const FOCUS_CHART_TITLE = t(msg => msg.analysis.trend.focusTitle)

function computeIndicatorSet(
    rows: timer.stat.Row[],
    dateRange: [Date, Date] | undefined,
): [IndicatorSet | undefined, Record<string, timer.stat.Row | undefined>] {
    const [start, end] = dateRange || []
    const allDates = start && end ? getAllDatesBetween(start, end) : []
    if (!rows) {
        // No data
        return [undefined, groupBy(allDates, date => date, _l => undefined)]
    }

    const days = allDates.length
    const periodRows = rows.filter(({ date }) => allDates.includes(date ?? ''))
    const periodRowMap = groupBy(periodRows, r => r.date, a => a[0])
    let focusMax: DailyIndicator
    let visitMax: DailyIndicator
    let focusTotal: number, visitTotal: number, activeDay: number
    focusMax = visitMax = { date: undefined, value: undefined }
    activeDay = focusTotal = visitTotal = 0

    const fullPeriodRow: Record<string, timer.stat.Row> = {}
    allDates.forEach(date => {
        const row = periodRowMap[date]
        if (!(fullPeriodRow[date] = row)) return
        const { focus, time: visit } = row
        focus > (focusMax.value ?? Number.MIN_SAFE_INTEGER) && (focusMax = { value: focus, date })
        visit > (visitMax.value ?? Number.MIN_SAFE_INTEGER) && (visitMax = { value: visit, date })
        focusTotal += focus
        visitTotal += visit
        focus && (activeDay += 1)
    })

    const indicators: IndicatorSet = {
        activeDay,
        focus: { max: focusMax, total: focusTotal, average: days == 0 ? undefined : focusTotal / days },
        visit: { max: visitMax, total: visitTotal, average: days == 0 ? undefined : visitTotal / days },
    }
    return [indicators, fullPeriodRow]
}

function lastRange(dateRange: [Date, Date]): [Date, Date] | undefined {
    const [start, end] = dateRange || []
    if (!start || !end) return undefined
    const dayLength = getDayLength(start, end)
    const newEnd = new Date(start.getTime() - MILL_PER_DAY)
    const newStart = new Date(start.getTime() - MILL_PER_DAY * dayLength)
    return [newStart, newEnd]
}

const visitFormatter: ValueFormatter = (val: number | undefined) => (Number.isInteger(val) ? val?.toString() : val?.toFixed(1)) ?? '-'

function handleDataChange(source: SourceParam, effect: EffectParam) {
    const { dateRange, rows } = source
    const { indicators, previousIndicators, focusData, visitData } = effect
    // 1. this period
    const [newIndicators, periodRows] = computeIndicatorSet(rows, dateRange)
    indicators.value = newIndicators
    const newFocusData: DimensionEntry[] = []
    const newVisitData: DimensionEntry[] = []
    Object.entries(periodRows)
        .forEach(([rowDate, row]) => {
            const { time, focus } = row || {}
            const date = cvt2LocaleTime(rowDate)
            newFocusData.push({ date, value: focus || 0 })
            newVisitData.push({ date, value: time || 0 })
        })
    // 2. last period
    const prevDateRange = lastRange(dateRange)
    const [preIndicator, prePeriodRows] = computeIndicatorSet(rows, prevDateRange)
    previousIndicators.value = preIndicator
    const preFocusData: DimensionEntry[] = []
    const preVisitData: DimensionEntry[] = []
    Object.entries(prePeriodRows)
        .forEach(([rowDate, row]) => {
            const { time, focus } = row || {}
            const date = cvt2LocaleTime(rowDate)
            preFocusData.push({ date, value: focus || 0 })
            preVisitData.push({ date, value: time || 0 })
        })
    focusData.value = { thisPeriod: newFocusData, previousPeriod: preFocusData }
    visitData.value = { thisPeriod: newVisitData, previousPeriod: preVisitData }
}

const _default = defineComponent(() => {
    const [dateRange, setDateRange] = useState<[Date, Date]>(daysAgo(14, 0))
    const rangeLength = computed(() => getDayLength(dateRange.value?.[0], dateRange.value?.[1]))
    initProvider(dateRange, rangeLength)

    const visitData = ref<DimensionData>()
    const focusData = ref<DimensionData>()
    const indicators = ref<IndicatorSet>()
    const previousIndicators = ref<IndicatorSet>()
    const rows = useAnalysisRows()
    const timeFormat = useAnalysisTimeFormat()

    const computeEffect = () => handleDataChange(
        { dateRange: dateRange.value, rows: rows.value },
        { indicators, previousIndicators, visitData, focusData }
    )
    watch([dateRange, rows], computeEffect)
    onMounted(computeEffect)

    return () => (
        <KanbanCard
            title={t(msg => msg.analysis.trend.title)}
            v-slots={{
                filter: () => <Filter dateRange={dateRange.value} onDateRangeChange={setDateRange} />
            }}
        >
            <div class="analysis-trend-content">
                <Total
                    activeDay={[indicators.value?.activeDay, previousIndicators.value?.activeDay]}
                    visit={[indicators.value?.visit?.total, previousIndicators.value?.visit?.total]}
                    focus={[indicators.value?.focus?.total, previousIndicators.value?.focus?.total]}
                />
                <Dimension
                    maxLabel={FOCUS_MAX}
                    maxValue={indicators.value?.focus?.max?.value}
                    maxDate={indicators.value?.focus?.max?.date}
                    averageLabel={FOCUS_AVE}
                    average={[indicators.value?.focus?.average, previousIndicators.value?.focus?.average]}
                    valueFormatter={val => periodFormatter(val, { format: timeFormat.value })}
                    data={focusData.value}
                    chartTitle={FOCUS_CHART_TITLE}
                />
                <Dimension
                    maxLabel={VISIT_MAX}
                    maxValue={indicators.value?.visit?.max?.value}
                    maxDate={indicators.value?.visit?.max?.date}
                    averageLabel={VISIT_AVE}
                    average={[indicators.value?.visit?.average, previousIndicators.value?.visit?.average]}
                    valueFormatter={visitFormatter}
                    data={visitData.value}
                    chartTitle={VISIT_CHART_TITLE}
                />
            </div>
        </KanbanCard>
    )
})

export default _default