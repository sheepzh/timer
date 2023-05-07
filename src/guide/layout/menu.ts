/**
 * Copyright (c) 2022-present Hengyang Zhang
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { Ref } from "vue"
import type { I18nKey } from "@guide/locale"

import { t } from "@guide/locale"
import { ElMenu, ElMenuItem, ElSubMenu } from "element-plus"
import { defineComponent, h, onMounted, ref } from "vue"
import { Router, useRouter } from "vue-router"
import {
    START_ROUTE,
    PRIVACY_ROUTE,
    USAGE_ROUTE,
    APP_PAGE_ROUTE,
    MERGE_ROUTE,
    VIRTUAL_ROUTE,
    BACKUP_ROUTE,
    LIMIT_ROUTE,
} from "@guide/router/constants"

type MenuConf = {
    route: string
    title: I18nKey
    children?: MenuConf[]
}

const MENU_CONFS: MenuConf[] = [{
    route: START_ROUTE,
    title: msg => msg.start.title,
}, {
    route: PRIVACY_ROUTE,
    title: msg => msg.privacy.title,
}, {
    route: USAGE_ROUTE,
    title: msg => msg.layout.menu.usage,
    children: [{
        route: APP_PAGE_ROUTE,
        title: msg => msg.app.title,
    }, {
        route: MERGE_ROUTE,
        title: msg => msg.merge.title,
    }, {
        route: VIRTUAL_ROUTE,
        title: msg => msg.virtual.title,
    }, {
        route: LIMIT_ROUTE,
        title: msg => msg.limit.title,
    }, {
        route: BACKUP_ROUTE,
        title: msg => msg.backup.title
    }],
}]

function renderWithConf(conf: MenuConf, router: Router, activeRoute: Ref<string>) {
    const { route, title, children } = conf
    if (children?.length) {
        return h(ElSubMenu, {
            index: route,
        }, {
            title: () => h('span', t(title)),
            default: () => children.map(child => renderWithConf(child, router, activeRoute))
        })
    }
    return h(ElMenuItem, {
        index: route,
        onClick: () => {
            router.push(route)
            activeRoute.value = route
        },
    }, () => h('span', t(title)))
}

const _default = defineComponent(() => {
    const router = useRouter()
    const activeRoute: Ref<string> = ref()
    // Initialize current route in a new macro task
    onMounted(() => setTimeout(() => activeRoute.value = router.currentRoute?.value?.path))
    return () => [
        h(ElMenu, {
            defaultOpeneds: MENU_CONFS.filter(m => m.children?.length).map(group => group.route),
            defaultActive: activeRoute.value,
        }, () => MENU_CONFS.map(conf => renderWithConf(conf, router, activeRoute)))
    ]
})

export default _default