/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { App } from "vue"
import type { RouteRecordRaw } from "vue-router"

import { createRouter, createWebHashHistory } from "vue-router"
import { OPTION_ROUTE, ANALYSIS_ROUTE, LIMIT_ROUTE, REPORT_ROUTE } from "./constants"
import metaService from "@service/meta-service"

const dataRoutes: RouteRecordRaw[] = [
    {
        path: '/data',
        redirect: '/data/dashboard',
    },
    // Needn't nested router 
    {
        path: '/data/dashboard',
        component: () => import('../components/dashboard')
    },
    {
        path: REPORT_ROUTE,
        component: () => import('../components/report')
    }, {
        path: ANALYSIS_ROUTE,
        component: () => import('../components/analysis')
    }, {
        path: '/data/manage',
        component: () => import('../components/data-manage')
    }
]

const behaviorRoutes: RouteRecordRaw[] = [
    {
        path: '/behavior',
        redirect: '/behavior/habit'
    }, {
        path: '/behavior/habit',
        component: () => import('../components/habit')
    }, {
        path: LIMIT_ROUTE,
        component: () => import('../components/limit')
    }
]

const additionalRoutes: RouteRecordRaw[] = [
    {
        path: '/additional',
        redirect: '/additional/whitelist'
    }, {
        path: '/additional/site-manage',
        component: () => import('../components/site-manage')
    }, {
        path: '/additional/whitelist',
        component: () => import('../components/whitelist')
    }, {
        path: '/additional/rule-merge',
        component: () => import('../components/rule-merge')
    }, {
        path: OPTION_ROUTE,
        component: () => import('../components/option')
    }
]

const otherRoutes: RouteRecordRaw[] = [
    {
        path: '/other',
        redirect: '/other/help'
    },
    {
        path: '/other/help',
        component: () => import('../components/help-us'),
    }
]

const routes: RouteRecordRaw[] = [
    { path: '/', redirect: '/data' },
    ...dataRoutes,
    ...behaviorRoutes,
    ...additionalRoutes,
    ...otherRoutes,
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

async function handleChange() {
    await router.isReady()
    const current = router.currentRoute.value.fullPath
    current && metaService.increaseApp(current)
    router.afterEach((to, from, failure: Error | void) => {
        if (failure || to.fullPath === from.fullPath) return
        metaService.increaseApp(to.fullPath)
    })
}

export default (app: App) => {
    app.use(router)
    handleChange()
}
