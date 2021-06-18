import { defineComponent, h, onMounted, ref, Ref } from "vue"
import { ElMenu, ElMenuItem, ElSubmenu } from "element-plus"
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from "vue-router"
import { I18nKey, t } from "../locale"

declare type MenuItem = {
    title: I18nKey
    icon: string
    route: string
    children?: MenuItem[]
}

// All menu items
const ALL_MENU: MenuItem[] = [
    {
        title: msg => msg.menu.data,
        icon: 's-platform',
        route: '/data',
        children: [
            {
                title: msg => msg.menu.dataReport,
                route: '/data/report',
                icon: 'date'
            }, {
                title: msg => msg.menu.dataHistory,
                route: '/data/history',
                icon: 'stopwatch'
            }, {
                title: msg => msg.menu.dataClear,
                route: '/data/clear',
                icon: 'folder'
            }
        ]
    }, {
        title: msg => msg.menu.setting,
        route: '/setting',
        icon: 'setting'
    }
]

const routerRef: Ref<Router> = ref()

const currentRouteRef: Ref<RouteLocationNormalizedLoaded> = ref()

const openMenu = (route: string, title: I18nKey) => {
    const router = routerRef.value
    const currentRoute = currentRouteRef.value
    if (currentRoute && currentRoute.path !== route) {
        router && router.push(route)
        document.title = t(title)
    }
}

const renderMenuLeaf = (menu: MenuItem) => h(ElMenuItem,
    { index: menu.route, onClick: () => openMenu(menu.route, menu.title) },
    {
        default: () => h('i', { class: `el-icon-${menu.icon}` }),
        title: () => h('span', t(menu.title))
    }
)

const renderMenu = (menu: MenuItem) => {
    // No children
    if (!menu.children || !menu.children.length) return renderMenuLeaf(menu)

    const subMenuProps = { index: menu.route }
    const subMenuSlots = {
        title: () => [h('i', { class: `el-icon-${menu.icon}` }), h('span', t(menu.title))],
        default: () => menu.children.map(renderMenuLeaf)
    }
    return h(ElSubmenu, subMenuProps, subMenuSlots)
}

const menuItems = () => ALL_MENU.map(renderMenu)

const _default = defineComponent<{}, {}>(() => {
    routerRef.value = useRouter()
    currentRouteRef.value = useRoute()

    onMounted(() => document.title = t(msg => msg.menu.data))

    return () => h(ElMenu,
        { defaultActive: currentRouteRef.value.path, defaultOpeneds: ['/data'] },
        { default: menuItems }
    )
})

export default _default