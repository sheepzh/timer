/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { StyleValue } from "vue"
import Wrapper, { BizOption } from "./Wrapper"
import { computed, defineComponent } from "vue"
import { usePeriodValue } from "../context"
import { useEcharts } from "@hooks/useEcharts"
import { useHabitFilter } from "../../context"

const CONTAINER_STYLE: StyleValue = {
    width: "100%",
    height: "100%",
}

const _default = defineComponent(() => {
    const value = usePeriodValue()
    const globalFilter = useHabitFilter()
    const bizOption = computed<BizOption>(() => ({
        data: value.value?.curr,
        timeFormat: globalFilter.value?.timeFormat,
    }))
    const { elRef } = useEcharts(Wrapper, bizOption, { manual: true })
    return () => <div style={CONTAINER_STYLE} ref={elRef} />
})

export default _default