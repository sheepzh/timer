import { defineComponent, h, onMounted, ref, Ref } from "vue"
import { ElMenu, ElMenuItem, ElMenuItemGroup, MenuItemRegistered } from "element-plus"
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from "vue-router"
import { I18nKey, t, locale } from "../locale"
import { Locale } from '../../util/i18n'
import { MenuMessage } from "../locale/components/menu"
import { GITHUB_ISSUE_ADD, HOME_PAGE, ZH_FEEDBACK_PAGE } from "../../util/constant/url"

declare type MenuItem = {
    title: keyof MenuMessage
    icon: string
    route?: string
    href?: string
}

declare type MenuGroup = {
    title: keyof MenuMessage
    children: MenuItem[]
}

/**
 * Use ZH_FEEDBACK_PAGE, if the locale is Chinese
 * 
 * @since 0.3.2
 */
const realFeedbackLink: string = locale === Locale.ZH_CN ? ZH_FEEDBACK_PAGE : GITHUB_ISSUE_ADD

const OTHER_MENU_ITEMS: MenuItem[] = [{
    title: 'feedback',
    href: realFeedbackLink,
    icon: 'chat-square'
}]
HOME_PAGE && OTHER_MENU_ITEMS.push({
    title: 'rate',
    href: HOME_PAGE,
    icon: 'sugar'
})

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
        }, {
            title: 'option',
            route: '/option',
            icon: 'set-up'
        }]
    }, {
        title: 'other',
        children: OTHER_MENU_ITEMS
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

const openHref = (href: string) => {
    chrome.tabs.create({ url: href })
}

const handleClick = (menuItem: MenuItem) => {
    const { route, title, href } = menuItem
    if (route) {
        openMenu(route, msg => msg.menu[title])
    } else {
        openHref(href)
    }
}

const renderMenuLeaf = (menu: MenuItem) => {
    const { route, title, icon } = menu
    const props: { onClick: (item: MenuItemRegistered) => void; index?: string } = { onClick: (_item) => handleClick(menu) }
    route && (props.index = route)
    return h(ElMenuItem, props,
        {
            default: () => h('i', { class: `el-icon-${icon}` }),
            title: () => h('span', t(msg => msg.menu[title]))
        }
    )
}

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
        { defaultActive: currentRouteRef.value.path },
        { default: menuItems }
    )
})

export default _default