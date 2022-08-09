/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@guide/locale"
import { defineComponent, h } from "vue"

const _default = defineComponent({
    name: "Header",
    render() {
        return h('div', {
            class: 'guide-header-container'
        }, h('h1', {
            class: 'guide-header'
        }, t(msg => msg.layout.header)))
    }
})

export default _default