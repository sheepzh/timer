/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import { defineComponent, h, onMounted, ref } from "vue"
import HostOptionInfo from "../../host-option-info"
import ChartWrapper from "./wrapper"

const _default = defineComponent({
    name: "TrendChart",
    setup(_, ctx) {
        const elRef: Ref<HTMLDivElement> = ref()
        const chartWrapper: ChartWrapper = new ChartWrapper()

        ctx.expose({
            render: (host: HostOptionInfo, dateRange: Date[], row: timer.stat.Row[]) => chartWrapper.render(host, dateRange, row),
        })

        onMounted(() => chartWrapper.init(elRef.value))

        return () => h('div', { class: 'chart-container', ref: elRef })
    }
})

export default _default
