/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { KanbanCard } from "@app/components/common/kanban"
import { t } from "@app/locale"
import { defineComponent } from "vue"
import { initProvider } from "./context"
import DailyTrend from "./DailyTrend"
import Distribution from "./Distribution"
import "./style.sass"
import Summary from "./Summary"
import TopK from "./TopK"

const DISTRIBUTION_MIN_DAY_LENGTH = 15

const _default = defineComponent(() => {
    const dateRangeLength = initProvider()

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