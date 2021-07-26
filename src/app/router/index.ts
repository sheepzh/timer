import { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { LIMIT_ROUTE } from '../../common/constants'
import RouterDatabase from '../../database/router-database'
import { OPTION_ROUTE, TREND_ROUTE } from './constants'

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

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/data'
    },
    ...dataRoutes,
    ...behaviorRoutes,
    {
        path: '/additional',
        component: () => import('../components/additional'),
    }, {
        path: OPTION_ROUTE,
        component: () => import('../components/option')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

const db: RouterDatabase = new RouterDatabase(chrome.storage.local)

async function handleChange() {
    await router.isReady()
    router.afterEach((to, from, failure: Error | void) => {
        if (failure || to.fullPath === from.fullPath) return
        db.update(to.fullPath)
    })
}

async function initRoute() {
    const lastRoute = await db.getHistory()
    if (lastRoute) router.replace(lastRoute)
}

export default (app: App) => {
    app.use(router)
    initRoute()
    handleChange()
}
