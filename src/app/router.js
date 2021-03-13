import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/record'
    }, {
        path: '/record',
        component: () => import('./components/Record'),
    }, {
        path: '/setting',
        component: () => import('./components/Setting'),
    }
]

export default new VueRouter({ routes })
