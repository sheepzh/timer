/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { StyleValue, computed, defineComponent } from "vue"
import Wrapper from "./Wrapper"
import { useEcharts } from "@hooks/useEcharts"
import { useRows } from "../context"
import { useHabitFilter } from "../../context"

const CONTAINER_STYLE: StyleValue = {
    width: "100%",
    height: "100%",
}

const _default = defineComponent(() => {
    const rows = useRows()
    const filter = useHabitFilter()
    const bizOption = computed(() => ({ rows: rows.value, timeFormat: filter.value?.timeFormat }))
    const { elRef } = useEcharts(Wrapper, bizOption, { manual: true })

    return () => <div style={CONTAINER_STYLE} ref={elRef} />
})

export default _default
