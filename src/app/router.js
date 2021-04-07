import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
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
        component: () => import('./components/Report')
    }, {
        path: '/data/history',
        component: () => import('./components/Trender')
    }, {
        path: '/data/clear',
        component: () => import('./components/Clear')
    }, {
        path: '/setting',
        component: () => import('./components/Setting'),
    }
]

export default new VueRouter({ routes })
