/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElAside, ElContainer } from "element-plus"
import { defineComponent, h } from "vue"
import Menu from "./menu"
import VersionTag from "./version-tag"
import { RouterView } from "vue-router"

const layoutContent = () => [
    h(ElAside, { width: '270px' }, () => h(Menu)),
    h(ElContainer, { class: 'app-container' }, () => h(RouterView)),
    h(VersionTag)
]

export default defineComponent(() => () => h(ElContainer, {}, () => layoutContent()))
