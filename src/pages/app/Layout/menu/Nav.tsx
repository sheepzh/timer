/**
 * Copyright (c) 2024-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { getUrl } from "@api/chrome/runtime"
import { t } from "@app/locale"
import { CloseBold, Link, Menu } from "@element-plus/icons-vue"
import { useSwitch } from "@hooks"
import { classNames } from "@pages/util/style"
import { ElBreadcrumb, ElBreadcrumbItem, ElIcon, ElMenu, ElMenuItem } from "element-plus"
import { defineComponent, h, onBeforeMount, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { NAV_MENUS } from "./item"
import { handleClick, initTitle } from "./route"

const findTitle = (routePath: string): string => {
    const title = NAV_MENUS.find(v => routePath === v.route)?.title
    return title ? t(title) : ''
}

const _default = defineComponent(() => {
    const router = useRouter()
    const title = ref('')
    const [showMenu, , closeMenu, toggleMenu] = useSwitch(false)

    const syncRouter = () => {
        const route = router.currentRoute.value
        route && (title.value = findTitle(route.path))
    }

    watch(router.currentRoute, syncRouter)

    onBeforeMount(() => initTitle(router))

    return () => (
        <div class={classNames("nav-container", showMenu.value ? 'open' : 'close')}>
            <div class="nav-content">
                <div class="bread-wrapper">
                    <ElIcon>
                        <img width='32' height='32' src={getUrl('static/images/icon.png')} />
                    </ElIcon>
                    <ElBreadcrumb separator="/">
                        <ElBreadcrumbItem>{t(msg => msg.meta.name)}</ElBreadcrumbItem>
                        {!!title.value && <ElBreadcrumbItem>{title.value}</ElBreadcrumbItem>}
                    </ElBreadcrumb>
                </div>
                <div onClick={toggleMenu}>
                    <ElIcon size="large">
                        {showMenu.value ? <CloseBold /> : <Menu />}
                    </ElIcon>
                </div>
            </div>
            {!!showMenu.value && (
                <div class="menu-wrapper">
                    <ElMenu>
                        {NAV_MENUS.map(item => (
                            <ElMenuItem
                                onClick={() => {
                                    handleClick(item, router)
                                    closeMenu()
                                }}
                            >
                                <ElIcon>
                                    {h(item.icon)}
                                </ElIcon>
                                <span>{t(item.title)}</span>
                                {!!item.href && <ElIcon size={12}><Link /></ElIcon>}
                            </ElMenuItem>
                        ))}
                    </ElMenu>
                </div>
            )}
        </div>
    )
})

export default _default