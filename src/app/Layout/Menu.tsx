/**
 * Copyright (c) 2021-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { IconProps } from "element-plus"
import type { Ref, StyleValue } from "vue"
import type { Router } from "vue-router"
import type { I18nKey } from "@app/locale"

import { defineComponent, h, onMounted, ref, watch } from "vue"
import { ElIcon, ElMenu, ElMenuItem, ElMenuItemGroup } from "element-plus"
import { useRouter } from "vue-router"
import { t } from "@app/locale"
import { getGuidePageUrl } from "@util/constant/url"
import { Aim, HelpFilled, Memo, Rank, SetUp, Stopwatch, Timer } from "@element-plus/icons-vue"
import Trend from "./icons/Trend"
import Table from "./icons/Table"
import Database from "./icons/Database"
import Whitelist from "./icons/Whitelist"
import Website from "./icons/Website"
import About from "./icons/About"
import { createTabAfterCurrent } from "@api/chrome/tab"
import { ANALYSIS_ROUTE, MERGE_ROUTE } from "@app/router/constants"

type _MenuItem = {
    title: I18nKey
    icon: IconProps | string
    route?: string
    href?: string
    index?: string
}

type _MenuGroup = {
    title: I18nKey
    children: _MenuItem[]
}

/**
 * Menu items
 */
const MENUS: _MenuGroup[] = [{
    title: msg => msg.menu.data,
    children: [{
        title: msg => msg.menu.dashboard,
        route: '/data/dashboard',
        icon: Stopwatch
    }, {
        title: msg => msg.menu.dataReport,
        route: '/data/report',
        icon: Table
    }, {
        title: msg => msg.menu.siteAnalysis,
        route: ANALYSIS_ROUTE,
        icon: Trend
    }, {
        title: msg => msg.menu.dataClear,
        route: '/data/manage',
        icon: Database
    }]
}, {
    title: msg => msg.menu.behavior,
    children: [{
        title: msg => msg.menu.habit,
        route: '/behavior/habit',
        icon: Aim
    }, {
        title: msg => msg.menu.limit,
        route: '/behavior/limit',
        icon: Timer
    }]
}, {
    title: msg => msg.menu.additional,
    children: [{
        title: msg => msg.menu.siteManage,
        route: '/additional/site-manage',
        icon: Website
    }, {
        title: msg => msg.menu.whitelist,
        route: '/additional/whitelist',
        icon: Whitelist
    }, {
        title: msg => msg.menu.mergeRule,
        route: MERGE_ROUTE,
        icon: Rank
    }, {
        title: msg => msg.menu.option,
        route: '/additional/option',
        icon: SetUp
    }]
}, {
    title: msg => msg.menu.other,
    children: [{
        title: msg => msg.base.guidePage,
        href: getGuidePageUrl(),
        icon: Memo,
        index: '_guide',
    }, {
        title: msg => msg.menu.helpUs,
        route: '/other/help',
        icon: HelpFilled,
    }, {
        title: msg => msg.menu.about,
        route: '/other/about',
        icon: About,
    }]
}]

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
        openMenu(route, title, router)
    } else {
        openHref(href)
        currentActive.value = router.currentRoute?.value?.path
    }
}

const iconStyle: StyleValue = {
    paddingRight: '4px',
    paddingLeft: '4px',
    height: '1em',
    lineHeight: '0.83em'
}

function renderMenuLeaf(menu: _MenuItem, router: Router, currentActive: Ref<string>) {
    const { route, title, icon, index } = menu
    return <ElMenuItem
        onClick={(_item) => handleClick(menu, router, currentActive)}
        index={index || route}
        v-slots={{
            default: () => (
                <ElIcon size={15} style={iconStyle}>
                    {h(icon)}
                </ElIcon>),
            title: () => <span>{t(title)}</span>
        }}
    />
}

async function initTitle(router: Router) {
    await router.isReady()
    const currentPath = router.currentRoute.value.path
    for (const group of MENUS) {
        for (const { route, title } of group.children) {
            const docTitle = route === currentPath && t(title)
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

    onMounted(() => initTitle(router))

    return () => (
        <div class="menu-container">
            <ElMenu defaultActive={currentActive.value}>
                {MENUS.map(menu => <ElMenuItemGroup title={t(menu.title)}>
                    {menu.children.map(item => renderMenuLeaf(item, router, currentActive))}
                </ElMenuItemGroup>)}
            </ElMenu>
        </div>
    )
})

export default _default