/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { computed, defineComponent } from "vue"
import { t } from "@app/locale"
import { KanbanCard } from "@app/components/common/kanban"
import Summary from "./Summary"
import TopK from "./TopK"
import Distribution from "./Distribution"
import DailyTrend from "./DailyTrend"
import "./style.sass"
import { useHabitFilter } from "../context"
import statService from "@service/stat-service"
import { initProvider } from "./context"
import { computedAsync } from "@vueuse/core"
import { getDayLength } from "@util/time"

const DISTRIBUTION_MIN_DAY_LENGTH = 15

const _default = defineComponent({
    setup: () => {
        const filter = useHabitFilter()
        const rows = computedAsync(() => statService.select({ exclusiveVirtual: true, date: filter.value?.dateRange }, true))
        initProvider(rows)
        const dateRangeLength = computed(() => getDayLength(filter.value?.dateRange?.[0], filter?.value?.dateRange?.[1]))
        return () => (
            <KanbanCard title={t(msg => msg.habit.site.title)}>
                <div class="habit-site-content">
                    <div class="col0">
                        <Summary />
                    </div>
                    <div class="col1" >
                        <TopK />
                    </div>
                    <div class="col2">
                        {dateRangeLength.value >= DISTRIBUTION_MIN_DAY_LENGTH
                            ? <DailyTrend />
                            : <Distribution />
                        }
                    </div>
                </div>
            </KanbanCard>
        )
    }
})

export default _default