import { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { TRENDER_ROUTE } from './constants'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/data'
    }, {
        path: '/data',
        redirect: '/data/report',
    },
    // Needn't nested router 
    {
        path: '/data/report',
        component: () => import('../components/report')
    }, {
        path: '/data/period',
        component: () => import('../components/period')
    }, {
        path: TRENDER_ROUTE,
        component: () => import('../components/trender')
    }, {
        path: '/data/clear',
        component: () => import('../components/clear')
    }, {
        path: '/setting',
        component: () => import('../components/setting'),
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default (app: App) => app.use(router)
