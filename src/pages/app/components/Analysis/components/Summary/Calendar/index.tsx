/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */
import { useEcharts } from "@hooks/useEcharts"
import { computed, defineComponent } from "vue"
import { useAnalysisRows, useAnalysisTimeFormat } from "../../../context"
import Wrapper, { BizOption } from "./Wrapper"

const _default = defineComponent(() => {
    const rows = useAnalysisRows()
    const timeFormat = useAnalysisTimeFormat()
    const bizOption = computed<BizOption>(() => ({ rows: rows.value, timeFormat: timeFormat.value }))
    const { elRef } = useEcharts(Wrapper, bizOption, { manual: false })
    return () => <div class="analysis-calendar-chart" ref={elRef} />
})

export default _default