/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { KanbanCard } from "@app/components/common/kanban"
import { t } from "@app/locale"
import statService, { type StatQueryParam } from "@service/stat-service"
import { getDayLength } from "@util/time"
import { computedAsync } from "@vueuse/core"
import { computed, defineComponent } from "vue"
import { useHabitFilter } from "../context"
import { initProvider } from "./context"
import DailyTrend from "./DailyTrend"
import Distribution from "./Distribution"
import "./style.sass"
import Summary from "./Summary"
import TopK from "./TopK"

const DISTRIBUTION_MIN_DAY_LENGTH = 15

const _default = defineComponent(() => {
    const filter = useHabitFilter()
    const rows = computedAsync(() => {
        const param: StatQueryParam = {
            exclusiveVirtual: true,
            date: filter.value?.dateRange,
        }
        return statService.select(param, true)
    }, [])
    initProvider(rows)
    const dateRangeLength = computed(() => getDayLength(filter.value?.dateRange?.[0], filter?.value?.dateRange?.[1]))

    return () => (
        <KanbanCard title={t(msg => msg.habit.site.title)}>
            <div class="habit-site-content">
                <Summary />
                <TopK />
                {dateRangeLength.value >= DISTRIBUTION_MIN_DAY_LENGTH
                    ? <DailyTrend />
                    : <Distribution />
                }
            </div>
        </KanbanCard>
    )
})

export default _default