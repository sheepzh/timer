/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { KanbanCard } from "@app/components/common/kanban"
import { t } from "@app/locale"
import { defineComponent } from "vue"
import Average from "./Average"
import { initProvider } from "./context"
import Filter from "./Filter"
import Stack from "./Stack"
import "./style.sass"
import Summary from "./Summary"
import Trend from "./Trend"

const _default = defineComponent(() => {
    const filter = initProvider()

    return () => (
        <KanbanCard
            title={t(msg => msg.habit.period.title)}
            v-slots={{ filter: () => <Filter /> }}
        >
            <div class="habit-period-content">
                <Summary />
                <div class="chart-container">
                    {filter.chartType === 'average' && <Average />}
                    {filter.chartType === 'trend' && <Trend />}
                    {filter.chartType === 'stack' && <Stack />}
                </div>
            </div>
        </KanbanCard>
    )
})

export default _default