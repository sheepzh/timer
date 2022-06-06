/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { App } from "vue"
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import { OPTION_ROUTE, TREND_ROUTE, LIMIT_ROUTE, REPORT_ROUTE } from "./constants"
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
        path: TREND_ROUTE,
        component: () => import('../components/trend')
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

const routes: RouteRecordRaw[] = [
    { path: '/', redirect: '/data' },
    ...dataRoutes,
    ...behaviorRoutes,
    ...additionalRoutes
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
