import { defineComponent, h, onMounted, ref, Ref } from "vue"
import { ElMenu, ElMenuItem, ElSubMenu } from "element-plus"
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from "vue-router"
import { I18nKey, t } from "../locale"
import { MenuMessage } from "../locale/components/menu"

declare type MenuItem = {
    title: keyof MenuMessage
    icon: string
    route: string
    children?: MenuItem[]
}

// All menu items
const ALL_MENU: MenuItem[] = [
    {
        title: 'data',
        icon: 's-platform',
        route: '/data',
        children: [
            {
                title: 'dataReport',
                route: '/data/report',
                icon: 'date'
            }, {
                title: 'dataHistory',
                route: '/data/history',
                icon: 'stopwatch'
            }, {
                title: 'dataClear',
                route: '/data/manage',
                icon: 'folder'
            }
        ]
    }, {
        title: 'behavior',
        icon: 'user-solid',
        route: '/behavior',
        children: [
            {
                title: 'habit',
                route: '/behavior/habit',
                icon: 'aim'
            }, {
                title: 'limit',
                route: '/behavior/limit',
                icon: 'time'
            }
        ]
    }, {
        title: 'additional',
        route: '/additional',
        icon: 'present'
    }, {
        title: 'option',
        route: '/option',
        icon: 'set-up'
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
    { index: menu.route, onClick: () => openMenu(menu.route, msg => msg.menu[menu.title]) },
    {
        default: () => h('i', { class: `el-icon-${menu.icon}` }),
        title: () => h('span', t(msg => msg.menu[menu.title]))
    }
)

const renderMenu = (menu: MenuItem) => {
    // No children
    if (!menu.children || !menu.children.length) return renderMenuLeaf(menu)

    const subMenuProps = { index: menu.route }
    const subMenuSlots = {
        title: () => [h('i', { class: `el-icon-${menu.icon}` }), h('span', t(msg => msg.menu[menu.title]))],
        default: () => menu.children.map(renderMenuLeaf)
    }
    return h(ElSubMenu, subMenuProps, subMenuSlots)
}

const menuItems = () => ALL_MENU.map(renderMenu)

const _default = defineComponent<{}, {}>(() => {
    routerRef.value = useRouter()
    currentRouteRef.value = useRoute()

    onMounted(() => document.title = t(msg => msg.menu.data))

    return () => h(ElMenu,
        { defaultActive: currentRouteRef.value.path, defaultOpeneds: ['/data', '/behavior'] },
        { default: menuItems }
    )
})

export default _default