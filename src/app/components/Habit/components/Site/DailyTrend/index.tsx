/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useEcharts } from "@hooks/useEcharts"
import { computed, defineComponent } from "vue"
import { useHabitFilter } from "../../context"
import { useRows } from "../context"
import TimelineWrapper, { BizOption } from "./Wrapper"

const _default = defineComponent(() => {
    const rows = useRows()
    const filter = useHabitFilter()
    const bizOption = computed<BizOption>(() => {
        return {
            rows: rows.value,
            timeFormat: filter.value?.timeFormat,
            dateRange: filter.value?.dateRange,
        }
    })
    const { elRef } = useEcharts(TimelineWrapper, bizOption, { manual: true })

    return () => <div class="daily-trend" ref={elRef} />
})

export default _default
