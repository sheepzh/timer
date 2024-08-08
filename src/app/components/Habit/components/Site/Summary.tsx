import { KanbanIndicatorCell } from "@app/components/common/kanban"
import { t } from "@app/locale"
import { periodFormatter } from "@app/util/time"
import { computed, defineComponent } from "vue"
import { useHabitFilter } from "../context"
import { useRows } from "./context"
import { computeAverageLen } from "./common"
import { sum } from "@util/array"
import { FilterOption } from "../HabitFilter"

type Result = {
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

const computeSummary = (rows: timer.stat.Row[] = [], filter: FilterOption): Result => {
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

const renderIndicator = (summary: Result, format: timer.app.TimeFormat) => {
    const {
        focus: { total: focusTotal, average: focusAverage } = {},
        count: { time, site, siteAverage },
        exclusiveToday4Average,
    } = summary
    return <>
        <div class="indicator-wrapper">
            <KanbanIndicatorCell
                mainName={t(msg => msg.analysis.common.focusTotal)}
                mainValue={periodFormatter(focusTotal, { format })}
                subTips={msg => msg.habit.common.focusAverage}
                subValue={periodFormatter(focusAverage, { format })}
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
        const filter = useHabitFilter()
        const rows = useRows()
        const summary = computed(() => computeSummary(rows.value, filter.value))

        return () => renderIndicator(summary.value, filter.value?.timeFormat)
    }
})

export default _default