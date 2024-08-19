/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { StyleValue, computed, defineComponent } from "vue"
import { useEcharts } from "@hooks/useEcharts"
import TimelineWrapper, { BizOption } from "./Wrapper"
import { useHabitFilter } from "../../context"
import { useRows } from "../context"

const CONTAINER_STYLE: StyleValue = {
    width: "100%",
    height: "100%",
}

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

    return () => <div style={CONTAINER_STYLE} ref={elRef} />
})

export default _default
