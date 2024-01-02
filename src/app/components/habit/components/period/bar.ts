/**
 * Copyright (c) 2021 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"

import BarWrapper from "./bar-wrapper"
import { defineComponent, h, onMounted, ref, watch } from "vue"
import { usePeriodFilter, usePeriodRows } from "./context"

const CONTAINER_STYLE: Partial<CSSStyleDeclaration> = {
    width: "100%",
    height: "100%",
}

const _default = defineComponent({
    setup() {
        const rows = usePeriodRows()
        const filter = usePeriodFilter()

        const elRef: Ref<HTMLDivElement> = ref()
        const wrapper: BarWrapper = new BarWrapper()
        onMounted(() => wrapper.init(elRef.value))

        watch([filter, rows], () => {
            const { periodSize, average } = filter.value || {}
            wrapper.render({ data: rows.value, averageByDate: average, periodSize })
        })

        return () => h('div', {
            style: CONTAINER_STYLE,
            ref: elRef
        })
    }
})

export default _default