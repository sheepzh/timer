/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElRow } from "element-plus"
import { defineComponent, h } from "vue"
import "./indicator-row.sass"

const _default = defineComponent({
    setup: (_, ctx) => {
        return () => h(ElRow, { class: "kanban-indicator-row" }, ctx.slots)
    }
})

export default _default