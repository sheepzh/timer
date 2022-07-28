/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import { defineComponent, h, onMounted, ref } from "vue"
import ChartWrapper from "./wrapper"

const _default = defineComponent({
    name: "TrendChart",
    setup(_, ctx) {
        const elRef: Ref<HTMLDivElement> = ref()
        const chartWrapper: ChartWrapper = new ChartWrapper()

        function render(filterOption: timer.app.trend.FilterOption, isOnMounted: boolean, row: timer.stat.Row[]) {
            chartWrapper.render({ ...filterOption, isFirst: isOnMounted }, row)
        }

        ctx.expose({
            render,
        })

        onMounted(() => chartWrapper.init(elRef.value))

        return () => h('div', { class: 'chart-container', ref: elRef })
    }
})

export default _default
