/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h, onMounted, ref, Ref } from "vue"
import { ElIcon, ElMenu, ElMenuItem, ElMenuItemGroup, MenuItemRegistered } from "element-plus"
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from "vue-router"
import { I18nKey, t } from "@app/locale"
import { MenuMessage } from "@app/locale/components/menu"
import { GITHUB_ISSUE_ADD, HOME_PAGE, MEAT_URL, TU_CAO_PAGE, ZH_FEEDBACK_PAGE } from "@util/constant/url"
import { Aim, Calendar, ChatSquare, Folder, Food, HotWater, Rank, SetUp, Stopwatch, Sugar, Tickets, Timer } from "@element-plus/icons-vue"
import ElementIcon from "../element-ui/icon"
import { locale } from "@util/i18n"
import { IS_EDGE } from "@util/constant/environment"

declare type MenuItem = {
    title: keyof MenuMessage
    icon: ElementIcon
    route?: string
    href?: string
    index?: string
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
let realFeedbackLink: string = GITHUB_ISSUE_ADD
if (locale === 'zh_CN') {
    // Gray for new feedback page
    // todo
    realFeedbackLink = IS_EDGE ? TU_CAO_PAGE : ZH_FEEDBACK_PAGE
}

const OTHER_MENU_ITEMS: MenuItem[] = [{
    title: 'feedback',
    href: realFeedbackLink,
    icon: ChatSquare,
    index: '_feedback'
}]
HOME_PAGE && OTHER_MENU_ITEMS.push({
    title: 'rate',
    href: HOME_PAGE,
    icon: Sugar,
    index: '_rate'
})
OTHER_MENU_ITEMS.push({
    title: 'meat',
    href: MEAT_URL,
    icon: Food,
    index: '_meat'
})

// All menu items
const ALL_MENU: MenuGroup[] = [
    {
        title: 'data',
        children: [{
            title: 'dataReport',
            route: '/data/report',
            icon: Calendar
        }, {
            title: 'dataHistory',
            route: '/data/history',
            icon: Stopwatch
        }, {
            title: 'dataClear',
            route: '/data/manage',
            icon: Folder
        }]
    }, {
        title: 'behavior',
        children: [{
            title: 'habit',
            route: '/behavior/habit',
            icon: Aim
        }, {
            title: 'limit',
            route: '/behavior/limit',
            icon: Timer
        }]
    }, {
        title: 'additional',
        children: [{
            title: 'siteManage',
            route: '/additional/site-manage',
            icon: HotWater
        }, {
            title: 'whitelist',
            route: '/additional/whitelist',
            icon: Tickets
        }, {
            title: 'mergeRule',
            route: '/additional/rule-merge',
            icon: Rank
        }, {
            title: 'option',
            route: '/additional/option',
            icon: SetUp
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

const iconStyle: Partial<CSSStyleDeclaration> = {
    paddingRight: '4px',
    paddingLeft: '4px',
    height: '1em',
    lineHeight: '0.83em'
}

const renderMenuLeaf = (menu: MenuItem) => {
    const { route, title, icon, index } = menu
    const props: { onClick: (item: MenuItemRegistered) => void; index?: string } = {
        onClick: (_item) => handleClick(menu)
    }
    const realIndex = index || route
    realIndex && (props.index = realIndex)
    return h(ElMenuItem, props,
        {
            default: () => h(ElIcon, { size: 15, style: iconStyle }, () => h(icon)),
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