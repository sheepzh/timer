/**
 * Copyright (c) 2021-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref, StyleValue } from "vue"
import type { Router } from "vue-router"
import { defineComponent, h, onMounted, ref, watch } from "vue"
import { ElIcon, ElMenu, ElMenuItem, ElMenuItemGroup } from "element-plus"
import { useRouter } from "vue-router"
import { t } from "@app/locale"
import { MenuItem, MENUS } from "./item"
import { handleClick, initTitle } from "./route"

const iconStyle: StyleValue = {
    paddingRight: '4px',
    paddingLeft: '4px',
    height: '1em',
    lineHeight: '0.83em'
}

function renderMenuLeaf(menu: MenuItem, router: Router, currentActive: Ref<string>) {
    const { route, title, icon, index } = menu
    return (
        <ElMenuItem
            onClick={() => handleClick(menu, router, currentActive)}
            index={index || route}
            v-slots={{
                default: () => (
                    <ElIcon size={15} style={iconStyle}>
                        {h(icon)}
                    </ElIcon>
                ),
                title: () => <span>{t(title)}</span>
            }}
        />)
}

const _default = defineComponent(() => {
    const router = useRouter()
    const currentActive: Ref<string> = ref()
    const syncRouter = () => {
        const route = router.currentRoute.value
        route && (currentActive.value = route.path)
    }
    watch(router.currentRoute, syncRouter)

    onMounted(() => initTitle(router))

    return () => (
        <div class="menu-container">
            <ElMenu defaultActive={currentActive.value}>
                {MENUS.map(menu => <ElMenuItemGroup title={t(menu.title)}>
                    {menu.children.map(item => renderMenuLeaf(item, router, currentActive))}
                </ElMenuItemGroup>)}
            </ElMenu>
        </div>
    )
})

export default _default