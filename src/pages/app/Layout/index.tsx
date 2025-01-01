/**
 * Copyright (c) 2021-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { initProvider } from "@app/context"
import { useRequest } from "@hooks"
import { CLZ_HIDDEN_MD_AND_UP, CLZ_HIDDEN_SM_AND_DOWN } from "@pages/element-ui/style"
import cateService from "@service/cate-service"
import { classNames } from "@util/style"
import { ElAside, ElContainer, ElHeader, ElScrollbar } from "element-plus"
import { defineComponent } from "vue"
import { RouterView } from "vue-router"
import HeadNav from "./menu/Nav"
import SideMenu from "./menu/Side"
import "./style"
import VersionTag from "./VersionTag"

const _default = defineComponent(() => {
    const { data: categories, refresh: refreshCategories } = useRequest(() => cateService.listAll())
    initProvider({ categories, refreshCategories })

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