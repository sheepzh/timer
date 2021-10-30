import { defineComponent, h, onMounted, ref, Ref } from "vue"
import { ElMenu, ElMenuItem, ElMenuItemGroup, ElSubMenu } from "element-plus"
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from "vue-router"
import { I18nKey, t } from "../locale"
import { MenuMessage } from "../locale/components/menu"

declare type MenuItem = {
    title: keyof MenuMessage
    icon: string
    route: string
}

declare type MenuGroup = {
    title: keyof MenuMessage
    children: MenuItem[]
}

// All menu items
const ALL_MENU: MenuGroup[] = [
    {
        title: 'data',
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
        children: [{
            title: 'additional',
            route: '/additional',
            icon: 'present'
        }]
    }, {
        title: 'option',
        children: [{
            title: 'option',
            route: '/option',
            icon: 'set-up'
        }]
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

const renderMenu = (menu: MenuGroup) => {

    const title = t(msg => msg.menu[menu.title])
    const subMenuSlots = {
        default: () => menu.children.map(renderMenuLeaf)
    }
    return h(ElMenuItemGroup, { title }, subMenuSlots)
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