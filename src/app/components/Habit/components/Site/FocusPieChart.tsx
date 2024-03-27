/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { StyleValue, computed, defineComponent } from "vue"
import FocusPieWrapper from "./FocusPieWrapper"
import { useHabitFilter } from "../context"
import { useRows } from "./context"
import { useEcharts } from "@hooks/useEcharts"

const CONTAINER_STYLE: StyleValue = {
    width: "100%",
    height: "100%",
}

const _default = defineComponent({
    setup() {
        const filter = useHabitFilter()
        const rows = useRows()
        const bizOption = computed(() => ({ rows: rows.value, timeFormat: filter.value?.timeFormat }))
        const { elRef } = useEcharts(FocusPieWrapper, bizOption, { manual: true })

        return () => <div style={CONTAINER_STYLE} ref={elRef} />
    },
})

export default _default
