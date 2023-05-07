/**
 * Copyright (c) 2021-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElAside, ElContainer, ElScrollbar } from "element-plus"
import { defineComponent, h } from "vue"
import Menu from "./menu"
import VersionTag from "./version-tag"
import { RouterView } from "vue-router"

const _default = defineComponent(() => {
    return () => h(ElContainer, {}, () => [
        h(ElAside, () => h(ElScrollbar, () => h(Menu))),
        h(ElContainer, { class: 'app-container' }, () => h(RouterView)),
        h(VersionTag)
    ])
})

export default _default