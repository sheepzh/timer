/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { defineComponent, h, onMounted, reactive, UnwrapRef } from "vue"
import { ElIcon, ElMenu, ElMenuItem, ElMenuItemGroup, MenuItemRegistered } from "element-plus"
import { RouteLocationNormalizedLoaded, Router, useRoute, useRouter } from "vue-router"
import { I18nKey, t } from "@app/locale"
import { MenuMessage } from "@app/locale/components/menu"
import { HOME_PAGE, MEAT_URL, TU_CAO_PAGE, TRANSLATION_ISSUE_PAGE } from "@util/constant/url"
import { Aim, Calendar, ChatSquare, Folder, Food, HotWater, Rank, SetUp, Stopwatch, Sugar, Tickets, Timer } from "@element-plus/icons-vue"
import ElementIcon from "../element-ui/icon"
import { locale } from "@util/i18n"

type _MenuItem = {
    title: keyof MenuMessage
    icon: ElementIcon
    route?: string
    href?: string
    index?: string
}

type _MenuGroup = {
    title: keyof MenuMessage
    children: _MenuItem[]
}

type _RouteProps = {
    router: Router
    current: RouteLocationNormalizedLoaded
}

/**
 * Generate menu items after locale initialized
 */
function generateMenus(): _MenuGroup[] {
    /**
     * Use TU_CAO_PAGE, if the locale is Chinese
     * 
     * @since 0.9.0
     */
    const isZhCn = locale === "zh_CN"

    const otherMenuItems: _MenuItem[] = []
    HOME_PAGE && otherMenuItems.push({
        title: 'rate',
        href: HOME_PAGE,
        icon: Sugar,
        index: '_rate'
    })
    if (isZhCn) {
        otherMenuItems.push({
            title: 'feedback',
            href: TU_CAO_PAGE,
            icon: ChatSquare,
            index: '_feedback'
        }, {
            title: 'meat',
            href: MEAT_URL,
            icon: Food,
            index: '_meat'
        })
    } else {
        otherMenuItems.push({
            title: 'translationMistake',
            href: TRANSLATION_ISSUE_PAGE,
            icon: ChatSquare,
            index: '_i18n'
        })
    }

    // All menu items
    return [{
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
        children: otherMenuItems
    }]
}

function openMenu(route: string, title: I18nKey, routeProps: UnwrapRef<_RouteProps>) {
    const routerVal = routeProps.router
    const currentRouteVal = routeProps.current
    if (currentRouteVal && currentRouteVal.path !== route) {
        routerVal && routerVal.push(route)
        document.title = t(title)
    }
}

const openHref = (href: string) => {
    chrome.tabs.create({ url: href })
}

function handleClick(_MenuItem: _MenuItem, routeProps: UnwrapRef<_RouteProps>) {
    const { route, title, href } = _MenuItem
    if (route) {
        openMenu(route, msg => msg.menu[title], routeProps)
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

function renderMenuLeaf(menu: _MenuItem, routeProps: UnwrapRef<_RouteProps>) {
    const { route, title, icon, index } = menu
    const props: { onClick: (item: MenuItemRegistered) => void; index?: string } = {
        onClick: (_item) => handleClick(menu, routeProps)
    }
    const realIndex = index || route
    realIndex && (props.index = realIndex)
    return h(ElMenuItem, props, {
        default: () => h(ElIcon, { size: 15, style: iconStyle }, () => h(icon)),
        title: () => h('span', t(msg => msg.menu[title]))
    })
}

function renderMenu(menu: _MenuGroup, props: UnwrapRef<_RouteProps>) {
    const title = t(msg => msg.menu[menu.title])
    return h(ElMenuItemGroup, { title }, () => menu.children.map(item => renderMenuLeaf(item, props)))
}

const _default = defineComponent({
    name: "LayoutMenu",
    setup() {
        const routeProps: UnwrapRef<_RouteProps> = reactive({
            router: useRouter(),
            current: useRoute()
        })

        onMounted(() => document.title = t(msg => msg.menu.data))

        return () => h(ElMenu,
            { defaultActive: routeProps.current.path },
            () => generateMenus().map(menu => renderMenu(menu, routeProps))
        )
    }
})

export default _default