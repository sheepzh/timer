import { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { LIMIT_ROUTE } from '../../common/constants'
import RouterDatabase from '../../database/router-database'
import { TRENDER_ROUTE } from './constants'

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
        path: TRENDER_ROUTE,
        component: () => import('../components/trender')
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
        path: '/setting',
        component: () => import('../components/setting'),
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
