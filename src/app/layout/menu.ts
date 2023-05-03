/**
 * Copyright (c) 2021-present Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"
import type ElementIcon from "@src/element-ui/icon"
import type { MenuItemRegistered } from "element-plus"
import type { Router } from "vue-router"
import type { I18nKey } from "@app/locale"
import type { MenuMessage } from "@i18n/message/app/menu"

import { defineComponent, h, onMounted, ref, watch } from "vue"
import { ElIcon, ElMenu, ElMenuItem, ElMenuItemGroup } from "element-plus"
import { useRouter } from "vue-router"
import { t } from "@app/locale"
import { HOME_PAGE, FEEDBACK_QUESTIONNAIRE, getGuidePageUrl } from "@util/constant/url"
import { Aim, Calendar, ChatSquare, Folder, HelpFilled, HotWater, Memo, Rank, SetUp, Stopwatch, Sugar, Tickets, Timer } from "@element-plus/icons-vue"
import { locale } from "@i18n"
import TrendIcon from "./icon/trend-icon"
import { createTabAfterCurrent } from "@api/chrome/tab"
import { ANALYSIS_ROUTE, MERGE_ROUTE } from "@app/router/constants"
import { START_ROUTE } from "@guide/router/constants"

type _MenuItem = {
    title: keyof MenuMessage
    icon: ElementIcon | any
    route?: string
    href?: string
    index?: string
}

type _MenuGroup = {
    title: keyof MenuMessage
    children: _MenuItem[]
}

/**
 * Generate menu items after locale initialized
 */
function generateMenus(): _MenuGroup[] {
    const otherMenuItems: _MenuItem[] = [{
        title: 'userManual',
        href: getGuidePageUrl(false, START_ROUTE),
        icon: Memo,
        index: '_guide',
    }, {
        title: 'helpUs',
        route: '/other/help',
        icon: HelpFilled,
    }]
    HOME_PAGE && otherMenuItems.push({
        title: 'rate',
        href: HOME_PAGE,
        icon: Sugar,
        index: '_rate'
    })
    const questionnairePage = FEEDBACK_QUESTIONNAIRE[locale]
    questionnairePage && otherMenuItems.push({
        title: 'feedback',
        href: questionnairePage,
        icon: ChatSquare,
        index: '_feedback'
    })

    // All menu items
    return [{
        title: 'data',
        children: [{
            title: 'dashboard',
            route: '/data/dashboard',
            icon: Stopwatch
        }, {
            title: 'dataReport',
            route: '/data/report',
            icon: Calendar
        }, {
            title: 'siteAnalysis',
            route: ANALYSIS_ROUTE,
            icon: TrendIcon
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
            route: MERGE_ROUTE,
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

function openMenu(route: string, title: I18nKey, router: Router) {
    const currentPath = router.currentRoute.value?.path
    if (currentPath !== route) {
        router?.push(route)
        document.title = t(title)
    }
}

const openHref = (href: string) => createTabAfterCurrent(href)

function handleClick(menuItem: _MenuItem, router: Router, currentActive: Ref<string>) {
    const { route, title, href } = menuItem
    if (route) {
        openMenu(route, msg => msg.menu[title], router)
        currentActive.value = '/data/dashboard'//route
    } else {
        openHref(href)
        currentActive.value = router.currentRoute?.value?.path
    }
}

const iconStyle: Partial<CSSStyleDeclaration> = {
    paddingRight: '4px',
    paddingLeft: '4px',
    height: '1em',
    lineHeight: '0.83em'
}

function renderMenuLeaf(menu: _MenuItem, router: Router, currentActive: Ref<string>) {
    const { route, title, icon, index } = menu
    const props: { onClick: (item: MenuItemRegistered) => void; index?: string } = {
        onClick: (_item) => handleClick(menu, router, currentActive)
    }
    const realIndex = index || route
    realIndex && (props.index = realIndex)
    return h(ElMenuItem, props, {
        default: () => h(ElIcon, { size: 15, style: iconStyle }, () => h(icon)),
        title: () => h('span', t(msg => msg.menu[title]))
    })
}

function renderMenu(menu: _MenuGroup, router: Router, currentActive: Ref<string>) {
    const title = t(msg => msg.menu[menu.title])
    return h(ElMenuItemGroup, { title }, () => menu.children.map(item => renderMenuLeaf(item, router, currentActive)))
}

async function initTitle(allMenus: _MenuGroup[], router: Router) {
    await router.isReady()
    const currentPath = router.currentRoute.value.path
    for (const group of allMenus) {
        for (const { route, title } of group.children) {
            const docTitle = route === currentPath && t(msg => msg.menu[title])
            if (docTitle) {
                document.title = docTitle
                return
            }
        }
    }
}

const _default = defineComponent(() => {
    const router = useRouter()
    const currentActive: Ref<string> = ref()
    const syncRouter = () => {
        const route = router.currentRoute.value
        route && (currentActive.value = route.path)
    }

    watch(router.currentRoute, syncRouter)

    const allMenus = generateMenus()
    onMounted(() => initTitle(allMenus, router))

    return () => h('div', { class: 'menu-container' }, h(ElMenu, { defaultActive: currentActive.value },
        () => allMenus.map(menu => renderMenu(menu, router, currentActive))
    ))
})

export default _default