/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Ref, computed, defineComponent, onMounted, ref, watch } from "vue"
import { t } from "@app/locale"
import { sum } from "@util/array"
import { KanbanCard, KanbanIndicatorCell } from "@app/components/common/kanban"
import HistogramChart from "./HistogramChart"
import FocusPieChart from "./FocusPieChart"
import TimePieChart from "./TimePieChart"
import "./style.sass"
import { useHabitFilter } from "../context"
import { FilterOption } from "../../type"
import { formatTime, getDayLength, isSameDay } from "@util/time"
import { periodFormatter } from "@app/util/time"
import statService from "@service/stat-service"
import { initProvider } from "./context"

type Summary = {
    focus: {
        total: number
        average: number
    }
    count: {
        site: number
        time: number
        siteAverage: number
    }
    exclusiveToday4Average: boolean
}

const computeAverageLen = (dateRange: [Date, Date] = [null, null]): [number, boolean, string] => {
    const [start, end] = dateRange
    if (!end) return [0, false, null]
    if (isSameDay(start, end)) return [1, false, null]
    const dateDiff = getDayLength(start, end)
    const endIsTody = isSameDay(end, new Date())
    if (endIsTody) {
        return [dateDiff - 1, true, formatTime(end, "{y}{m}{d}")]
    } else {
        return [dateDiff, false, null]
    }
}

const computeSummary = (rows: timer.stat.Row[] = [], filter: FilterOption): Summary => {
    const [averageLen, exclusiveToday4Average, exclusiveDate] = computeAverageLen(filter?.dateRange)
    const totalFocus = sum(rows.map(r => r.focus))
    const totalFocus4Average = exclusiveDate ? sum(rows.filter(r => r.date !== exclusiveDate).map(r => r.focus)) : totalFocus
    const totalTime = sum(rows.map(r => r.time))
    const totalSite = new Set(rows.map(row => row.host)).size
    const totalSite4Average = exclusiveDate ? rows.filter(r => r.date !== exclusiveDate).length : rows.length

    return {
        focus: {
            total: totalFocus,
            average: averageLen ? totalFocus4Average / averageLen : 0,
        },
        count: {
            time: totalTime,
            site: totalSite,
            siteAverage: averageLen ? totalSite4Average / averageLen : 0,
        },
        exclusiveToday4Average,
    }
}

const renderIndicator = (summary: Summary, timeFormat: timer.app.TimeFormat) => {
    const {
        focus: { total: focusTotal, average: focusAverage } = {},
        count: { time, site, siteAverage },
        exclusiveToday4Average,
    } = summary
    return <>
        <div class="indicator-wrapper">
            <KanbanIndicatorCell
                mainName={t(msg => msg.analysis.common.focusTotal)}
                mainValue={focusTotal ? periodFormatter(focusTotal, timeFormat) : '-'}
                subTips={msg => msg.habit.common.focusAverage}
                subValue={focusAverage ? periodFormatter(focusAverage, timeFormat) : '-'}
                subInfo={exclusiveToday4Average ? t(msg => msg.habit.site.exclusiveToday) : null}
            />
        </div>
        <div class="indicator-wrapper">
            <KanbanIndicatorCell
                mainName={t(msg => msg.habit.site.countTotal)}
                mainValue={[time ? `${time}` : '-', site ? `${site}` : '-'].join(" / ")}
                subTips={msg => msg.habit.site.siteAverage}
                subValue={siteAverage?.toFixed(0) || '-'}
                subInfo={exclusiveToday4Average ? t(msg => msg.habit.site.exclusiveToday) : null}
            />
        </div>
    </>
}

const _default = defineComponent({
    setup: () => {
        const rows: Ref<timer.stat.Row[]> = ref([])
        initProvider(rows)

        const filter = useHabitFilter()
        const summary = computed(() => computeSummary(rows.value, filter.value))

        const fetchRows = async () => {
            rows.value = await statService.select({ exclusiveVirtual: true, date: filter.value?.dateRange }, true)
        }

        onMounted(fetchRows)
        watch(filter, fetchRows)

        return () => (
            <KanbanCard title={t(msg => msg.habit.site.title)}>
                <div class="habit-site-content">
                    <div class="col0">
                        {renderIndicator(summary.value, filter.value?.timeFormat)}
                    </div>
                    <div class="col1" >
                        <HistogramChart />
                    </div>
                    <div class="col2">
                        <FocusPieChart />
                    </div>
                    <div class="col3">
                        <TimePieChart />
                    </div>
                </div>
            </KanbanCard>
        )
    }
})

export default _default