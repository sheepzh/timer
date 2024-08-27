/**
 * Copyright (c) 2021-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ElAside, ElContainer, ElHeader, ElScrollbar } from "element-plus"
import { defineComponent } from "vue"
import SideMenu from "./menu/Side"
import HeadNav from "./menu/Nav"
import VersionTag from "./VersionTag"
import { RouterView } from "vue-router"
import { classNames } from "@util/style"
import { CLZ_HIDDEN_MD_AND_UP, CLZ_HIDDEN_SM_AND_DOWN } from "@src/element-ui/style"
import "./style"

const _default = defineComponent(() => {
    return () => (
        <ElContainer class="app-layout">
            <ElHeader class={classNames('app-header', CLZ_HIDDEN_MD_AND_UP)}>
                <HeadNav />
            </ElHeader>
            <ElContainer>
                <ElAside class={classNames('app-aside', CLZ_HIDDEN_SM_AND_DOWN)}>
                    <ElScrollbar>
                        <SideMenu />
                    </ElScrollbar>
                </ElAside>
                <ElContainer class="app-container">
                    <RouterView />
                </ElContainer>
            </ElContainer>
            <VersionTag />
        </ElContainer>
    )
})

export default _default