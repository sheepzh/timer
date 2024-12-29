/**
 * Copyright (c) 2024 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElRow } from "element-plus"
import { PropType, StyleValue, defineComponent, h } from "vue"
import "./indicator-row.sass"

const _default = defineComponent({
    props: {
        style: Object as PropType<StyleValue>
    },
    setup: ({ style }, ctx) => {
        return () => <ElRow class='kanban-indicator-row' style={style} v-slots={ctx.slots} />
    }
})

export default _default