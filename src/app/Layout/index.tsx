/**
 * Copyright (c) 2021-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElAside, ElContainer, ElScrollbar } from "element-plus"
import { defineComponent } from "vue"
import Menu from "./Menu"
import VersionTag from "./VersionTag"
import { RouterView } from "vue-router"

const _default = defineComponent(() => {
    return () => (
        <ElContainer>
            <ElAside>
                <ElScrollbar>
                    <Menu />
                </ElScrollbar>
            </ElAside>
            <ElContainer class="app-container">
                <RouterView />
            </ElContainer>
            <VersionTag />
        </ElContainer>
    )
})

export default _default