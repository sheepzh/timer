import { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { LIMIT_ROUTE } from '../common/constants'

const dataRoutes: RouteRecordRaw[] = [
    {
        path: '/data',
        redirect: '/data/report',
    },
    // Needn't nested router 
    {
        path: '/data/report',
        component: () => import('./components/report')
    }, {
        path: '/data/history',
        component: () => import('./components/trender')
    }, {
        path: '/data/clear',
        component: () => import('./components/clear')
    }
]

const behaviorRoutes: RouteRecordRaw[] = [
    {
        path: '/behavior',
        redirect: '/behavior/habit'
    }, {
        path: '/behavior/habit',
        component: () => import('./components/habit')
    }, {
        path: LIMIT_ROUTE,
        component: () => import('./components/limit')
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
        component: () => import('./components/setting'),
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default (app: App) => app.use(router)
