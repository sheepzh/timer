/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { StyleValue, defineComponent } from "vue"
import TimePieWrapper from "./TimePieWrapper"
import { useRows } from "./context"
import { useEcharts } from "@hooks"

const CONTAINER_STYLE: StyleValue = {
    width: "100%",
    height: "100%",
}

const _default = defineComponent({
    setup() {
        const rows = useRows()
        const { elRef } = useEcharts(TimePieWrapper, rows, { manual: true })

        return () => <div style={CONTAINER_STYLE} ref={elRef} />
    },
})

export default _default
