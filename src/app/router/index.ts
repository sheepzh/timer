/**
 * Copyright (c) 2021 Hengyang Zhang
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { App } from "vue"
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import RouterDatabase from "@db/router-database"
import { OPTION_ROUTE, TREND_ROUTE, LIMIT_ROUTE } from "./constants"

const dataRoutes: RouteRecordRaw[] = [
    {
        path: '/data',
        redirect: '/data/report',
    },
    // Needn't nested router 
    {
        path: '/data/report',
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

const db: RouterDatabase = new RouterDatabase(chrome.storage.local)

async function handleChange() {
    await router.isReady()
    const current = router.currentRoute.value.fullPath
    current && await db.update(current)
    router.afterEach((to, from, failure: Error | void) => {
        if (failure || to.fullPath === from.fullPath) return
        db.update(to.fullPath)
    })
}

export default (app: App) => {
    app.use(router)
    handleChange()
}
