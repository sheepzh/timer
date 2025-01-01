/**
 * Copyright (c) 2023 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { type DimensionEntry, type ValueFormatter } from "@app/components/Analysis/util"
import { useEcharts } from "@hooks/useEcharts"
import { defineComponent, watch, type PropType } from "vue"
import Wrapper from "./Wrapper"

const _default = defineComponent({
    props: {
        data: Array as PropType<DimensionEntry[]>,
        previous: Array as PropType<DimensionEntry[]>,
        title: String,
        valueFormatter: Function as PropType<ValueFormatter>
    },
    setup(props) {
        const { elRef, refresh } = useEcharts(Wrapper, () => ({
            entries: props.data,
            preEntries: props.previous,
            title: props.title,
            valueFormatter: props.valueFormatter,
        }))

        watch([() => props.data, () => props.valueFormatter], refresh)
        return () => <div class="analysis-trend-dimension-chart" ref={elRef} />
    }
})

export default _default
