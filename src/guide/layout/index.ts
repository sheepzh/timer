/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElContainer, ElAside, ElMain, ElHeader, ElScrollbar } from "element-plus"
import { defineComponent, h } from "vue"
import Header from "./header"
import Menu from "./menu"
import { RouterView, useRoute } from "vue-router"
import { HOME_ROUTE } from "@guide/router/constants"

const renderMain = () => h(ElContainer, {}, () => [
    h(ElAside, () => h(ElScrollbar, () => h(Menu))),
    h(ElMain, () => h(ElScrollbar, () => h(RouterView))),
])

const _default = defineComponent(() => {
    const route = useRoute()
    return () => h(ElContainer, { class: 'guide-container' }, () => [
        h(ElHeader, () => h(Header)),
        route.path === HOME_ROUTE ? h(RouterView) : renderMain(),
    ])
})

export default _default