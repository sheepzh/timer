/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Ref, StyleValue, defineComponent, onMounted, ref, watch } from "vue"
import TimePieWrapper from "./TimePieWrapper"
import { useRows } from "./context"

const CONTAINER_STYLE: StyleValue = {
    width: "100%",
    height: "100%",
}

const _default = defineComponent({
    setup() {
        const elRef: Ref<HTMLDivElement> = ref()
        const wrapper: TimePieWrapper = new TimePieWrapper()
        const rows = useRows()

        onMounted(() => wrapper.init(elRef.value))
        watch([rows], () => wrapper.render(rows.value))
        return () => <div style={CONTAINER_STYLE} ref={elRef} />
    },
})

export default _default
