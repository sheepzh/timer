/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import ChartWrapper from "./wrapper"
import { defineComponent, h, onMounted, ref } from "vue"

export type HabitChartInstance = {
    render(data: timer.period.Row[], averageByDate: boolean, periodSize: number): void
}

const _default = defineComponent({
    name: "HabitChart",
    setup(_, ctx) {
        const elRef: Ref<HTMLDivElement> = ref()
        const wrapper: ChartWrapper = new ChartWrapper()
        onMounted(() => wrapper.init(elRef.value))
        const instance: HabitChartInstance = {
            render: (data, averageByDate, periodSize) => wrapper.render(data, averageByDate, periodSize)
        }
        ctx.expose(instance)
        return () => h('div', {
            class: 'chart-container',
            ref: elRef
        })
    }
})

export default _default