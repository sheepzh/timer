import { defineComponent, h, onMounted } from "vue"
import { ElMenu, ElMenuItem, ElSubmenu } from "element-plus"
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from "vue-router"
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

const _default = defineComponent<{}, {}>(() => {
    const router = useRouter()
    const currentRoute: RouteLocationNormalizedLoaded = useRoute()

    onMounted(() => document.title = t(msg => msg.menu.data))

    const openMenu = (route: string, title: I18nKey) => {
        if (currentRoute.path !== route) {
            router.push(route)
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
        if (menu.children && menu.children.length) {
            return h(ElSubmenu,
                { index: menu.route },
                {
                    title: () => [h('i', { class: `el-icon-${menu.icon}` }), h('span', t(menu.title))],
                    default: () => menu.children.map(renderMenuLeaf)
                }
            )
        } else {
            return renderMenuLeaf(menu)
        }
    }

    const menuItems = () => ALL_MENU.map(renderMenu)

    return () => h(ElMenu,
        { defaultActive: currentRoute.path, defaultOpeneds: ['/data'] },
        { default: menuItems }
    )
})

export default _default