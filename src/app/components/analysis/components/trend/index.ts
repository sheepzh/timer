/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import type { DimensionEntry, ValueFormatter } from "@app/components/analysis/util"
import type { PropType, Ref, ComputedRef } from "vue"

import { defineComponent, h, ref, watch, computed } from "vue"
import RowCard from "../common/row-card"
import Filter from "./filter"
import Total from "./total"
import Dimension from "./dimension"
import { t } from "@app/locale"
import './style.sass'
import { MILL_PER_DAY, daysAgo, getAllDatesBetween, getDayLenth } from "@util/time"
import { ElRow } from "element-plus"
import { cvt2LocaleTime, periodFormatter } from "@app/util/time"
import { groupBy } from "@util/array"

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
    const dayLength = getDayLenth(start, end)
    const newEnd = new Date(start.getTime() - MILL_PER_DAY)
    const newStart = new Date(start.getTime() - MILL_PER_DAY * dayLength)
    return [newStart, newEnd]
}

const visitFormatter: ValueFormatter = (val: number) => {
    if (Number.isInteger(val)) {
        return val.toString()
    } else {
        return val?.toFixed(1) || '-'
    }
}

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

const renderTotal = (
    indicators: IndicatorSet,
    lastIndicators: IndicatorSet,
    timeFormat: timer.app.TimeFormat,
    rangeLength: number,
) => h('div',
    { class: 'analysis-trend-content-col0' },
    h(Total, {
        activeDay: [indicators?.activeDay, lastIndicators?.activeDay],
        rangeLength: rangeLength,
        visit: [indicators?.visit?.total, lastIndicators?.visit?.total],
        focus: [indicators?.focus?.total, lastIndicators?.focus?.total],
        timeFormat,
    })
)

const renderFocusTrend = (
    indicators: IndicatorSet,
    lastIndicators: IndicatorSet,
    timeFormat: timer.app.TimeFormat,
    data: DimensionEntry[],
) => h('div',
    { class: 'analysis-trend-content-col1' },
    h(Dimension, {
        maxLabel: FOCUS_MAX,
        maxValue: indicators?.focus?.max?.value,
        maxDate: indicators?.focus?.max?.date,
        averageLabel: FOCUS_AVE,
        average: [indicators?.focus?.average, lastIndicators?.focus?.average],
        valueFormatter: (val: number) => val === undefined ? '-' : periodFormatter(val, timeFormat),
        data,
        chartTitle: FOCUS_CHART_TITLE,
    })
)

const renderVisitTrend = (
    indicators: IndicatorSet,
    lastIndicators: IndicatorSet,
    data: DimensionEntry[],
) => h('div',
    { class: 'analysis-trend-content-col2' },
    h(Dimension, {
        maxLabel: VISIT_MAX,
        maxValue: indicators?.visit?.max?.value,
        maxDate: indicators?.visit?.max?.date,
        averageLabel: VISIT_AVE,
        average: [indicators?.visit?.average, lastIndicators?.visit?.average],
        valueFormatter: visitFormatter,
        data,
        chartTitle: VISIT_CHART_TITLE,
    })
)

const _default = defineComponent({
    props: {
        rows: Array as PropType<timer.stat.Row[]>,
        timeFormat: String as PropType<timer.app.TimeFormat>,
    },
    setup(props) {
        const dateRange: Ref<[Date, Date]> = ref(daysAgo(29, 0))
        const visitData: Ref<DimensionEntry[]> = ref([])
        const focusData: Ref<DimensionEntry[]> = ref([])
        const indicators: Ref<IndicatorSet> = ref()
        const lastIndicators: Ref<IndicatorSet> = ref()
        const timeFormat: Ref<timer.app.TimeFormat> = ref(props.timeFormat)
        const rangeLength: ComputedRef = computed(() => getDayLenth(dateRange.value?.[0], dateRange.value?.[1]))

        const compute = () => handleDataChange(
            { dateRange: dateRange.value, rows: props.rows },
            { indicators, lastIndicators, visitData, focusData }
        )

        watch(() => props.rows, compute)
        watch(dateRange, compute)
        watch(() => props.timeFormat, () => timeFormat.value = props.timeFormat)

        compute()
        return () => h(RowCard, {
            title: t(msg => msg.analysis.trend.title),
            class: 'analysis-trend-container',
        }, () => [
            h(Filter, {
                dateRange: dateRange.value,
                onDateRangeChange: (newVal: [Date, Date]) => dateRange.value = newVal,
            }),
            h(ElRow, { class: 'analysis-trend-content' }, () => [
                renderTotal(indicators.value, lastIndicators.value, timeFormat.value, rangeLength.value),
                renderFocusTrend(indicators.value, lastIndicators.value, timeFormat.value, focusData.value),
                renderVisitTrend(indicators.value, lastIndicators.value, visitData.value),
            ])
        ])
    }
})

export default _default