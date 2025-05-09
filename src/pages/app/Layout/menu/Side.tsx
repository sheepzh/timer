/**
 * Copyright (c) 2021-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { t } from "@app/locale"
import { ElIcon, ElMenu, ElMenuItem, ElMenuItemGroup } from "element-plus"
import { defineComponent, h, onMounted, ref, watch, type Ref, type StyleValue } from "vue"
import { useRouter, type Router } from "vue-router"
import { MENUS, type MenuItem } from "./item"
import { handleClick, initTitle } from "./route"

const iconStyle: StyleValue = {
    paddingInline: '4px',
    height: '1em',
    lineHeight: '0.83em',
}

function renderMenuLeaf(menu: MenuItem, router: Router, currentActive: Ref<string | undefined>) {
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
    const currentActive = ref<string>()
    const syncRouter = () => {
        const route = router.currentRoute.value
        route && (currentActive.value = route.path)
    }
    watch(router.currentRoute, syncRouter)

    onMounted(() => initTitle(router))

    return () => (
        <div class="menu-container">
            <ElMenu defaultActive={currentActive.value} style={{ border: 'none' }}>
                {MENUS.map(menu => <ElMenuItemGroup title={t(menu.title)}>
                    {menu.children.map(item => renderMenuLeaf(item, router, currentActive))}
                </ElMenuItemGroup>)}
            </ElMenu>
        </div>
    )
})

export default _default