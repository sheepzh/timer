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
import Wrapper from "./Wrapper"

const _default = defineComponent(() => {
    const rows = useRows()
    const filter = useHabitFilter()
    const bizOption = computed(() => ({ rows: rows.value, timeFormat: filter.value?.timeFormat }))
    const { elRef } = useEcharts(Wrapper, bizOption, { manual: true })

    return () => <div class="top-k" ref={elRef} />
})

export default _default
