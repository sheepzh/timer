/**
 * Copyright (c) 2022 Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElContainer } from "element-plus"
import { defineComponent, h } from "vue"
import { RouterView } from "vue-router"
import Header from "../components/common/header"

const _default = defineComponent({
    name: "Guide",
    render() {
        return h(ElContainer, { class: 'guide-container' }, () => [
            h(Header),
            h(RouterView)
        ])
    }
})

export default _default