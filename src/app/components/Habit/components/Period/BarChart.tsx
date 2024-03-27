/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { StyleValue } from "vue"
import BarWrapper from "./BarWrapper"
import { computed, defineComponent } from "vue"
import { usePeriodFilter, usePeriodRows } from "./context"
import { useEcharts } from "@hooks/useEcharts"

const CONTAINER_STYLE: StyleValue = {
    width: "100%",
    height: "100%",
}

const _default = defineComponent({
    setup() {
        const rows = usePeriodRows()
        const filter = usePeriodFilter()
        const bizOption = computed(() => {
            const { periodSize, average } = filter.value || {}
            return { data: rows.value, averageByDate: average, periodSize }
        })
        const { elRef } = useEcharts(BarWrapper, bizOption, { manual: true })
        return () => <div style={CONTAINER_STYLE} ref={elRef} />
    }
})

export default _default