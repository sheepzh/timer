/**
 * Copyright (c) 2023 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { PropType, Ref } from "vue"
import type { DimensionEntry, ValueFormatter } from "@app/components/analysis/util"

import { defineComponent, h, watch, onMounted, ref } from "vue"
import ChartWrapper from "./wrapper"

const _default = defineComponent({
    props: {
        data: Array as PropType<DimensionEntry[]>,
        title: String,
        valueFormatter: Function as PropType<ValueFormatter>
    },
    setup(props) {
        const elRef: Ref<HTMLDivElement> = ref()
        const wrapper: ChartWrapper = new ChartWrapper()
        const render = () => wrapper.render(props.data, props.title, props.valueFormatter)

        watch(() => props.data, render)
        watch(() => props.valueFormatter, render)

        onMounted(() => {
            wrapper.init(elRef.value)
            render()
        })

        return () => h('div', { class: 'analysis-trend-dimension-chart', ref: elRef })
    }
})

export default _default
