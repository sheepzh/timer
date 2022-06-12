/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElTableColumn } from "element-plus"
import { defineComponent, h } from "vue"

const _default = defineComponent({
    name: "ReportSelection",
    props: {
        disabled: Boolean
    },
    setup(props) {
        return () => h(ElTableColumn, {
            type: "selection",
            selectable: (_row, _index) => !props.disabled
        })
    }
})

export default _default