/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { DimensionEntry, ValueFormatter } from "@app/components/Analysis/util"
import type { Ref } from "vue"

import { defineComponent, ref, watch, computed, onMounted } from "vue"
import { KanbanCard } from "@app/components/common/kanban"
import Filter from "./Filter"
import Total from "./Total"
import Dimension from "./Dimension"
import { t } from "@app/locale"
import './style.sass'
import { MILL_PER_DAY, daysAgo, getAllDatesBetween, getDayLength } from "@util/time"
import { cvt2LocaleTime, periodFormatter } from "@app/util/time"
import { groupBy } from "@util/array"
import { useAnalysisRows, useAnalysisTimeFormat } from "../../context"
import { initProvider } from "./context"

type DailyIndicator = {
    value: number
    date: string
}

type GlobalIndicator = number

type DimensionType = 'focus' | 'visit'

type IndicatorSet = Record<DimensionType, {
    max: DailyIndicator
    total: GlobalIndicator
    average: GlobalIndicator
}> & {
    activeDay: number
}

type SourceParam = {
    dateRange: [Date, Date]
    rows?: timer.stat.Row[]
}

type EffectParam = {
    indicators: Ref<IndicatorSet>
    lastIndicators: Ref<IndicatorSet>
    focusData: Ref<DimensionEntry[]>
    visitData: Ref<DimensionEntry[]>
}

const VISIT_MAX = t(msg => msg.analysis.trend.maxVisit)
const VISIT_AVE = t(msg => msg.analysis.trend.averageVisit)
const VISIT_CHART_TITLE = t(msg => msg.analysis.trend.visitTitle)
const FOCUS_MAX = t(msg => msg.analysis.trend.maxFocus)
const FOCUS_AVE = t(msg => msg.analysis.trend.averageFocus)
const FOCUS_CHART_TITLE = t(msg => msg.analysis.trend.focusTitle)

function computeIndicatorSet(rows: timer.stat.Row[], dateRange: [Date, Date]): [IndicatorSet, Record<string, timer.stat.Row>] {
    const [start, end] = dateRange || []
    const allDates = start && end ? getAllDatesBetween(start, end) : []
    if (!rows) {
        // No data
        return [undefined, groupBy(allDates, date => date, _l => undefined)]
    }

    const days = allDates.length
    const periodRows = rows.filter(({ date }) => allDates.includes(date))
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

function lastRange(dateRange: [Date, Date]): [Date, Date] {
    const [start, end] = dateRange || []
    if (!start || !end) return undefined
    const dayLength = getDayLength(start, end)
    const newEnd = new Date(start.getTime() - MILL_PER_DAY)
    const newStart = new Date(start.getTime() - MILL_PER_DAY * dayLength)
    return [newStart, newEnd]
}

const visitFormatter: ValueFormatter = (val: number) => Number.isInteger(val) ? val.toString() : val?.toFixed(1) || '-'

function handleDataChange(source: SourceParam, effect: EffectParam) {
    const { dateRange, rows } = source
    const { indicators, lastIndicators, focusData, visitData } = effect
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
    focusData.value = newFocusData
    visitData.value = newVisitData
    // 2. last period
    lastIndicators.value = computeIndicatorSet(rows, lastRange(dateRange))[0]
}

const _default = defineComponent(() => {
    const dateRange: Ref<[Date, Date]> = ref(daysAgo(29, 0))
    const rangeLength: Ref<number> = computed(() => getDayLength(dateRange.value?.[0], dateRange.value?.[1]))
    initProvider(dateRange, rangeLength)

    const visitData: Ref<DimensionEntry[]> = ref([])
    const focusData: Ref<DimensionEntry[]> = ref([])
    const indicators: Ref<IndicatorSet> = ref()
    const lastIndicators: Ref<IndicatorSet> = ref()
    const rows = useAnalysisRows()
    const timeFormat = useAnalysisTimeFormat()

    const computeEffect = () => handleDataChange(
        { dateRange: dateRange.value, rows: rows.value },
        { indicators, lastIndicators, visitData, focusData }
    )
    watch([dateRange, rows], computeEffect)
    onMounted(computeEffect)

    return () => (
        <KanbanCard
            title={t(msg => msg.analysis.trend.title)}
            v-slots={{
                filter: () => <Filter dateRange={dateRange.value} onDateRangeChange={val => dateRange.value = val} />
            }}
        >
            <div class="analysis-trend-content">
                <div class="analysis-trend-content-col0">
                    <Total
                        activeDay={[indicators.value?.activeDay, lastIndicators.value?.activeDay]}
                        visit={[indicators.value?.visit?.total, lastIndicators.value?.visit?.total]}
                        focus={[indicators.value?.focus?.total, lastIndicators.value?.focus?.total]}
                    />
                </div>
                <div class="analysis-trend-content-col1">
                    <Dimension
                        maxLabel={FOCUS_MAX}
                        maxValue={indicators.value?.focus?.max?.value}
                        maxDate={indicators.value?.focus?.max?.date}
                        averageLabel={FOCUS_AVE}
                        average={[indicators.value?.focus?.average, lastIndicators.value?.focus?.average]}
                        valueFormatter={val => val === undefined ? '-' : periodFormatter(val, timeFormat.value)}
                        data={focusData.value}
                        chartTitle={FOCUS_CHART_TITLE}
                    />
                </div>
                <div class="analysis-trend-content-col2">
                    <Dimension
                        maxLabel={VISIT_MAX}
                        maxValue={indicators.value?.visit?.max?.value}
                        maxDate={indicators.value?.visit?.max?.date}
                        averageLabel={VISIT_AVE}
                        average={[indicators.value?.visit?.average, lastIndicators.value?.visit?.average]}
                        valueFormatter={visitFormatter}
                        data={visitData.value}
                        chartTitle={VISIT_CHART_TITLE}
                    />
                </div>
            </div>
        </KanbanCard>
    )
})

export default _default