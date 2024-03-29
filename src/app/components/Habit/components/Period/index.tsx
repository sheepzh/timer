/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { KanbanCard, KanbanIndicatorCell } from "@app/components/common/kanban"
import { t } from "@app/locale"
import { PropType, Ref, defineComponent, watch, ref, computed, onMounted } from "vue"
import Filter, { FilterOption } from "./Filter"
import BarChart from "./BarChart"
import "./style.sass"
import { merge } from "@service/components/period-calculator"
import { periodFormatter } from "@app/util/time"
import periodService from "@service/period-service"
import { useHabitFilter } from "../context"
import { daysAgo, formatTime, isSameDay } from "@util/time"
import { MAX_PERIOD_ORDER, keyBefore, keyOf } from "@util/period"
import { initProvider } from "./context"
import { averageByDay } from "./common"

type Summary = {
    favorite: {
        period: string
        average: number
    }
    longestIdle: {
        length: string
        period: string
    }
}

const computeSummary = (rows: timer.period.Row[], periodSize: number): Summary => {
    const averaged = averageByDay(rows, periodSize)
    const favoriteRow = averaged.sort((b, a) => a.milliseconds - b.milliseconds)[0]
    let favoritePeriod = '-'
    if (favoriteRow) {
        const start = favoriteRow.startTime
        const end = favoriteRow.endTime
        favoritePeriod = `${formatTime(start, "{h}:{i}")}-${formatTime(end, "{h}:{i}")}`
    }

    let maxIdle: [timer.period.Row, timer.period.Row, number] = [, , 0]

    let idleStart: timer.period.Row = null, idleEnd: timer.period.Row = null
    rows.forEach(r => {
        if (r.milliseconds) {
            if (!idleStart) return
            const newEmptyTs = idleEnd.endTime.getTime() - idleStart.endTime.getTime()
            if (newEmptyTs > maxIdle[2]) {
                maxIdle = [idleStart, idleEnd, newEmptyTs]
            }
            idleStart = idleEnd = null
        } else {
            idleEnd = r
            !idleStart && (idleStart = idleEnd)
        }
    })

    const [start, end] = maxIdle

    let idleLength = '-'
    let idlePeriod = null
    if (start && end) {
        idleLength = periodFormatter(end.endTime.getTime() - start.startTime.getTime(), { format: 'hour' })
        const format = t(msg => msg.calendar.simpleTimeFormat)
        const startTime = formatTime(start.startTime, format)
        const endTime = formatTime(end.endTime, format)
        idlePeriod = startTime + '-' + endTime
    }

    return {
        favorite: {
            period: favoritePeriod,
            average: favoriteRow?.milliseconds,
        },
        longestIdle: {
            length: idleLength,
            period: idlePeriod,
        }
    }
}

const renderIndicator = (summary: Summary, format: timer.app.TimeFormat) => {
    const {
        favorite: { period: favoritePeriod = null, average = null },
        longestIdle: { period: idlePeriod, length: idleLength },
    } = summary || {}
    return <>
        <div class="indicator-wrapper">
            <KanbanIndicatorCell
                mainName={t(msg => msg.habit.period.busiest)}
                mainValue={favoritePeriod}
                subTips={msg => msg.habit.common.focusAverage}
                subValue={periodFormatter(average, { format })}
            />
        </div>
        <div class="indicator-wrapper">
            <KanbanIndicatorCell
                mainName={t(msg => msg.habit.period.idle)}
                mainValue={idleLength}
                subTips={() => idlePeriod}
            />
        </div>
    </>
}

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

const _default = defineComponent({
    props: {
        result: Array as PropType<timer.period.Result[]>,
        range: Object as PropType<timer.period.KeyRange>,
    },
    setup: () => {
        const globalFilter = useHabitFilter()
        const periodRange = computed(() => computeParam(globalFilter.value?.dateRange))
        const rows: Ref<timer.period.Row[]> = ref([])
        const filter: Ref<FilterOption> = ref({ periodSize: 1, average: false })

        initProvider(periodRange, rows, filter)

        const fetchRows = async () => {
            const results = await periodService.list({ periodRange: periodRange.value })
            const [start, end] = periodRange.value || []
            const periodSize = filter.value?.periodSize
            rows.value = merge(results, { start, end, periodSize })
        }

        watch([periodRange, filter], fetchRows)
        onMounted(fetchRows)

        const summary = computed(() => computeSummary(rows.value, filter.value?.periodSize))
        return () => <KanbanCard
            title={t(msg => msg.habit.period.title)}
            v-slots={{
                filter: () => <Filter defaultValue={filter.value} onChange={val => filter.value = val} />,
                default: () => <div class="habit-period-content">
                    <div class="col0">
                        {renderIndicator(summary.value, globalFilter.value?.timeFormat)}
                    </div>
                    <div class="col1">
                        <BarChart />
                    </div>
                </div>
            }}
        />
    }
})

export default _default