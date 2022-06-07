/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import ChartWrapper from "./wrapper"
import { defineComponent, h, onMounted, ref } from "vue"
import PeriodResult from "@entity/dto/period-result"

const _default = defineComponent({
    name: "HabitChart",
    setup(_, ctx) {
        const elRef: Ref<HTMLDivElement> = ref()
        const wrapper: ChartWrapper = new ChartWrapper()
        onMounted(() => wrapper.init(elRef.value))
        ctx.expose({
            render: (data: PeriodResult[], averageByDate: boolean, periodSize: number) => wrapper.render(data, averageByDate, periodSize)
        })
        return () => h('div', {
            class: 'chart-container',
            ref: elRef
        })
    }
})

export default _default