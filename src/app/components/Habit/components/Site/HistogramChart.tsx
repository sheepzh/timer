/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Ref, StyleValue, defineComponent, onMounted, ref, watch } from "vue"
import HistogramWrapper from "./HistogramWrapper"
import { useRows } from "./context"
import { useHabitFilter } from "../context"

const CONTAINER_STYLE: StyleValue = {
    width: "100%",
    height: "100%",
}

const _default = defineComponent({
    setup() {
        const elRef: Ref<HTMLDivElement> = ref()
        const wrapper: HistogramWrapper = new HistogramWrapper()
        const rows = useRows()
        const filter = useHabitFilter()

        onMounted(() => wrapper.init(elRef.value))
        watch([rows, filter], () => wrapper.render({ rows: rows.value, timeFormat: filter.value?.timeFormat }))

        return () => <div style={CONTAINER_STYLE} ref={elRef} />
    },
})

export default _default
