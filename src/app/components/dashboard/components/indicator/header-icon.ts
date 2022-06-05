/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Sunrise } from "@element-plus/icons-vue"
import { ElIcon } from "element-plus"
import { defineComponent, h } from "vue"

const _default = defineComponent({
    name: "IndicatorHeaderIcon",
    setup() {
        return () => h('div', {
            class: 'indicator-icon-header'
        }, h(ElIcon, {}, () => h(Sunrise)))
    }
})

export default _default